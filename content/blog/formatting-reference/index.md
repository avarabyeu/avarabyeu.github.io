---
title: Formatting reference
description: Every element a post can use, in one place. A draft, so it never reaches the live site.
date: 2026-10-02
tags: [Reference, Hugo]
draft: true
---

This draft exists to show how each Markdown element renders. Preview it with `task serve`; it is never built
for production. Delete it whenever it stops being useful.

## Headings carry anchors

Hover a heading to reveal its `#` link. Section links are handy when sharing a specific part of a long post.

### Third-level heading

#### Fourth level, as a label

Body text is IBM Plex Sans at a comfortable measure. **Bold** and *italic* work as usual, and so do
[links](https://avarabyeu.me/). Inline code looks like `kubectl get pods -A`.

## Lists

- Durable execution instead of duct tape
- Multitenancy designed in, not bolted on
  - nested items indent cleanly
- Infrastructure that's boring in the right ways

1. Reproduce the problem
2. Measure it
3. Change one thing at a time

## Quotes

> The operator treats "a tenant" as a Kubernetes resource and reconciles a dedicated instance for each.

## Code

```go
// Reconcile makes the cluster match one tenant's desired state.
func (r *TenantReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	var tenant v1.Tenant
	if err := r.Get(ctx, req.NamespacedName, &tenant); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}
	return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
}
```

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: ClusterQueue
metadata:
  name: gpu-eu
spec:
  resourceGroups:
    - coveredResources: ["nvidia.com/gpu"]
      flavors:
        - name: a100
          resources:
            - name: "nvidia.com/gpu"
              nominalQuota: 8
```

```sh
task new-post -- my-post-slug
```

## Tables

| Approach | Isolation | Upgrade path |
|---|---|---|
| Fork RASA | per fork | painful, manual rebase |
| Operator per tenant | per instance | upstream releases |

## Images

A standalone image with a title becomes a captioned figure. Keep images in the post's folder, next to `index.md`. An SVG without `width`/`height` attributes stretches to the full text column, which suits diagrams; give small graphics explicit dimensions.

![The site's cube mark](cube.svg "Captions use the same small mono style as the homepage diagrams.")

---

A horizontal rule, then a footnote reference.[^1]

[^1]: Footnotes collect at the bottom of the post.
