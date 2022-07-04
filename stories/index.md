---
title: "Stories"
---

{% for story in collections.story reversed %}

* [{{ story.data.title }}]({{ story.url }})

{% endfor %}
