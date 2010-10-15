---
title: Blog
layout: default
section: blog
---

<h2 class="blog-header">Recent Posts</h2>

<div id="blog">
    <ul class="posts">
      {% for post in site.posts limit: 5 %}
        <li>
            <a href="{{ post.url }}">{{ post.title }}</a> <span>({{ post.date | date:"%Y-%m-%d" }})</span><br>
            <em>{{ post.excerpt }} </em>
        </li>
      {% endfor %}
    </ul>
</div>