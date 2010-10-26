---
title: Blog
layout: default
section: blog
---

<div id="blog">
    <h2>Recent Posts</h2>

    <ul class="posts">
        {% for post in site.posts %}
        <li>
            <a href="{{ post.url }}" class="blog-link">{{ post.title }}</a> <span class="blog-date">({{ post.date | date_to_string }})</span><br>
            <em class="blog-excerpt">{{ post.excerpt }} </em>
        </li>
      {% endfor %}
    </ul>
    <p id="rss"><a href="{{ site.root }}/atom.xml"><img src="{{ site.root }}/images/rss_icon.png"> Atom feed</a></p>
</div>
