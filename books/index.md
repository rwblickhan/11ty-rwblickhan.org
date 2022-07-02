---
title: "Book Logs"
---

{% for book in collections.book %}

* [{{ book.data.title }}]({{ book.url }})

{% endfor %}
