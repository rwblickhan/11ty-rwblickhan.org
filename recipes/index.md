---
title: "Recipes"
---
{% for recipe in collections.recipe %}

* [{{ recipe.data.title }}]({{ recipe.url }})

{% endfor %}
