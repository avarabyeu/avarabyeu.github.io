---
layout: post
title: ReportPortal. Расширяем Java агента
description:
modified: 2017-06-01
tags: [ru, tech]
lang: ru
comments: true
share: false

image:
  feature:

published: true
---
{% include image.html path="posts/rp_site.png" path-detail="posts/rp_site.png" alt="ReportPortal" %}

Итак, вот и наступил тот замечательный день, когда мы наконец убрали тонны инкапсуляций и дали возможность расширять Java-based клиента. Просили об этом уже очень долго, имплементить это было не сложно - поскольку клиент значительно переписывался под асинхронный репортинг, покосить private'ы не составляло труда. Встречаем.

**RP Java Client v3.x**

Пару слов о новом клиенте. Как уже было замечено выше, написано все это дело теперь в асинхронном стиле, с использванием RXJava. Долго думал - RXJava или Reactor. Второй привлекал более адекватным (на мой взгляд) апи и родственными связями со Spring Framework. Значит, уже совсем скоро, с выходом Spring Framework v5 и Spring Boot v2 станет крайне популярен. Но, гвозди в крышку гроба фреймворка от Netflix решительно забивал тот факт, что Reactor написан исключительно под JDK 1.8, а среди наших клиентов есть люди крайне ~~обиженные жизнью~~старомодные (банки), могут и на 1.6 еще сидеть.
Итак, клиентик асинхронный. Дабы избавить потенциальных контрибьюторов от боли связанной с коллбэками и ожиданиями, зашил все в один класс - ReportPortal (как ни странно)
По сути, это и есть точка, через которую происходит репортинг - выглядит на первый взгляд очень похоже на то что было и раньше, разве что промисы ```(Maybe<ID>)``` возвращается вместо самих айдишников.

**Так как тут что расширять?**

Хорошо это или плохо, но пока Guice остался центральным звеном, через которое происходит конфигурация всего клиента. Часто слышал критику - можно было и на обычных фэкторях вальнуть. Наверное, так и есть. Но сегодня на примере попытаюсь объяснить, почему с Guice работать все-таки удобно. Один из самых типичных вопросов\просьб - "дайте добавить тэги на рантайме". Давайте подумаем - что для этого нужно? Очевидно, нужно найти то место, которое отправляет запрос, куда эти самые тэги вкладываются. Речь идет о запросе на создание сьюта\теста\степа\. Мы для простоты называем их тест айтемами. У каждого тест айтема есть тип - собственно, SUITE,STORY,TEST,SCENARIO,STEP и т.д.
Итак, мы знаем что всю эту информацию связанную с репортингом тест айтемов клиент узнает посредством листенера. Листенер делегирует вызовы в ```com.epam.reportportal.testng.TestNGService```, но сперва создает контекст Guice. В этот момент происходит чтение пропертей и инициализация (не всегда, если не lazy) бинов, которые в этом контекстве проспецифицированы. Guice прост. Он основан на так называемых модулях - по сути, классах-конфигурациях. И его преимущество в том, что эти модули можно расширять, переопределять и вообще все что хочешь с ними делать. В нашем случае - нам нужно переопределить тот самый ```TestNGService```. Смотрим на листенер:

```java
public class BaseTestNGListener implements IExecutionListener, ISuiteListener, IResultListener2 {
    ...

    public BaseTestNGListener(final Module... extensions) {
        this(Injector.createDefault(extensions));
    }

    public BaseTestNGListener(final Injector injector) {
        this(new Supplier<ITestNGService>() {
            @Override
            public ITestNGService get() {
                return injector.getBean(ITestNGService.class);
            }
        });
    }

    public BaseTestNGListener(final Supplier<ITestNGService> testNgService) {
        isSuiteStarted.set(false);
        testNGService = memoize(testNgService);
    }
    ...
```
Как видим, эти модули нужно передать в конструктор, вся остальная магия остается за кадром. Стандартных модулей несколько:

* ```ConfigurationModule``` содержит в себе все что связано с конфигурацией. Например, чтение пропертей из проперти файла.
* ```ReportPortalClientModule``` - основной модуль. Тут Http клиент, тот самый ```ReportPortal``` класс и все что им необходимо.

В нашем случае мы используем TestNG и в проекте этого агента есть еще один дополнительный модуль
* ```TestNGAgentModule``` - там как раз-таки и лежит то, что мы собираемся расширять - ```TestNGService```

Итак, наследуемся от этого класса и находим в нем метод, который `готовит` запрос на создание теста (степа, сьюта, выберите по вкусу):

```java
protected StartTestItemRQ buildStartStepRq(ITestResult testResult) {
      if (testResult.getAttribute(RP_ID) != null) {
          return null;
      }
      StartTestItemRQ rq = new StartTestItemRQ();
      String testStepName = testResult.getMethod().getMethodName();
      rq.setName(testStepName);

      rq.setDescription(createStepDescription(testResult));
      rq.setStartTime(Calendar.getInstance().getTime());
      rq.setType(TestMethodType.getStepType(testResult.getMethod()).toString());
      return rq;
  }
```

Расширяем:
```java
public class MyTestNgService extends TestNGService {

public MyTestNgService(ListenerParameters parameters, ReportPortalClient reportPortalClient) {
            super(parameters, reportPortalClient);
}

@Override
protected StartTestItemRQ buildStartStepRq(ITestResult testResult) {
    //вызываем родителя и создаем валидный объект запроса
    final StartTestItemRQ rq = super
            .buildStartStepRq(testResult);

    //добавляем наш новый важный тэг и те тэги, которые были добавлены по дефолту
    rq.setTags(ImmutableSet.<String>builder()
            .addAll(rq.getTags())
            .add("my_very_improtant_tag")
    .build());
    return rq;
}
...
```
Отлично! Теперь осталось сказать репорт порталу, что нужно использовать вашу имплементацию, вместо стандартной.

```java
public class MyRpListener extends BaseTestNGListener {
    // делаем свой листенер
    public MyRpListener() {
        //'переопредели стандартны модуль TestNGAgentModule' другим
        super(override(new TestNGAgentModule()).with(
                (Module) binder -> binder.bind(ITestNGService.class).toProvider(new TestNGProvider() {
                    @Override
                    protected TestNGService createTestNgService(
                            ListenerParameters listenerParameters,
                            ReportPortalClient reportPortalClient) {
                        return new MyTestNgService(listenerParameters, reportPortalClient);
                    }
                })));
    }
}
```

Вот и все. Теперь можем использовать ```MyRpListener``` как обычно - добавлять в pom.xml\build.gradle и иже с ними. Сложно? По-моему, не очень. Расширяемо? Вполне. Париться откуда взять зависимости типа ReportPortalClient или ListenerParameters нужно? Нет. Именно поэтому Guice, а не рукотворные костыле-фабрики. Инжой!

**Вопросы и комментарии категорически приветствуются!**
