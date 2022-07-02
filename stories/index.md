---
title: "Stories"
---

{% for story in collections.story %}

* [{{ story.data.title }}]({{ story.url }})

{% endfor %}
