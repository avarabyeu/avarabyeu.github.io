FROM ruby:2.6.3

# install dependensies
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y nodejs npm

WORKDIR /app

COPY Gemfile Gemfile.lock bower.json ./
COPY bin/setup bin/setup
RUN bin/setup


COPY . .
# Build site.
RUN bower install --allow-root

ENV LC_ALL="C.UTF-8"
ENV LANG="en_US.UTF-8"
ENV LANGUAGE="en_US.UTF-8"
ENTRYPOINT bundle exec jekyll build
