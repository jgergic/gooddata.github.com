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
    <p id="rss">
        <a href="http://feeds.feedburner.com/gooddata-developer-blog" title="Subscribe to blog feed" rel="alternate" type="application/rss+xml"><img src="http://www.feedburner.com/fb/images/pub/feed-icon32x32.png" alt="" style="border:0"/></a><a href="http://feeds.feedburner.com/gooddata-developer-blog" title="Subscribe to my feed" rel="alternate" type="application/rss+xml">Subscribe in a reader</a>
    </p>
</div>
