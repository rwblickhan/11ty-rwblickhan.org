---
title: "Book Logs"
---

{% for book in collections.book reversed %}

* [{{ book.data.title }}]({{ book.url }})

{% endfor %}
