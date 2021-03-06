#!/usr/bin/env python

# The MIT License (MIT)
#
# Copyright (c) 2018 Sunaina Pai
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
# CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


"""Make static website/blog with Python."""

import os
import shutil
import re
import glob
import sys
import json
import datetime
from jinja2 import Template

# OWN CODE
import sass


# END

def fread(filename):
    """Read file and close the file."""
    with open(filename, 'r', encoding="utf8") as f:
        return f.read()


def get_template(filename):
    """Return the template"""
    content = fread(filename)
    return Template(content)


def fwrite(filename, text):
    """Write content to file and close the file."""
    basedir = os.path.dirname(filename)
    if not os.path.isdir(basedir):
        os.makedirs(basedir)

    with open(filename, 'w', encoding="utf8") as f:
        f.write(text)


def log(msg, *args):
    """Log message with specified arguments."""
    sys.stderr.write(msg.format(*args) + '\n')


def truncate(text, words=25):
    """Remove tags and truncate text to the specified number of words."""
    return ' '.join(re.sub('(?s)<.*?>', ' ', text).split()[:words])


def read_headers(text):
    """Parse headers in text and yield (key, value, end-index) tuples."""
    for match in re.finditer(r'\s*<!--\s*(.+?)\s*:\s*(.+?)\s*-->\s*|.+', text):
        if not match.group(1):
            break
        yield match.group(1), match.group(2), match.end()




def read_content(filename, common_path):
    """Read content and metadata from file into a dictionary."""
    # Read file content.
    text = fread(filename)

    # Read metadata and save it in a dictionary.
    date_slug = os.path.basename(filename).split('.')[0]
    match = re.search(r'^(?:(\d\d\d\d-\d\d-\d\d)-)?(.+)$', date_slug)

    slug = filename.replace(common_path, '').split('.')[0]

    content = {
        'date': match.group(1) or '1970-01-01',
        'slug': slug,
        'hide': False
    }

    # Read headers.
    end = 0
    for key, val, end in read_headers(text):
        content[key] = val

    # Separate content from headers.
    text = text[end:]

    # Convert Markdown content to HTML.
    if filename.endswith(('.md', '.mkd', '.mkdn', '.mdown', '.markdown')):
        try:
            if _test == 'ImportError':
                raise ImportError('Error forced by test')
            import commonmark
            text = commonmark.commonmark(text)
        except ImportError as e:
            log('WARNING: Cannot render Markdown in {}: {}', filename, str(e))

    # Update the dictionary with content and RFC 2822 date.
    """Convert yyyy-mm-dd date string to RFC 2822 format date string."""
    date = datetime.datetime.strptime(content['date'], '%Y-%m-%d')
    rfc_2822_date = date.strftime('%a, %d %b %Y %H:%M:%S +0000')

    content.update({
        'content': text,
        'date_object': date,
        'rfc_2822_date': rfc_2822_date
    })

    content['hide'] = (content['hide'] == 'True' or content['hide'] == True)

    return content


def render(template, **params):
    """Replace placeholders in template with values from params."""
    return re.sub(r'{{\s*([^}\s]+)\s*}}',
                  lambda match: str(params.get(match.group(1), match.group(0))),
                  template)


def render_layout(template, **params):
    """Replace placeholders in template with values from params."""
    output = template.render(params)
    return output


def make_pages(src, dst, page_layout, post_layout, **params):
    """Generate pages from page content."""
    items = []

    for src_path in glob.glob(src, recursive=True):
        src_path = src_path.replace("\\", "/")
        common_path = os.path.commonprefix([src, src_path])
        content = read_content(src_path, common_path)

        page_params = dict(params, **content)

        # Populate placeholders in content if content-rendering is enabled.
        if page_params.get('render') == 'yes':
            rendered_content = render(page_params['content'], **page_params)
            page_params['content'] = rendered_content
            content['content'] = rendered_content

        items.append(content)

        dst_path = render(dst, **page_params)

        # Combine layouts to form final layouts.
        post = render_layout(post_layout, **page_params)
        page_params['content'] = post
        page = render_layout(page_layout, **page_params)
        
        log('Rendering {} => {} ...', src_path, dst_path)
        fwrite(dst_path, page)

    items = filter(lambda x: (x['hide'] != True), items)
    result = sorted(items, key=lambda x: x['date_object'], reverse=True)
    return result


def make_category_pages(posts, dst, page_layout, list_layout, item_layout, **params):
    all_paths = {}
    for post in posts:
        categories = []
        parts = post['slug'].split("/")
        parts.pop()

        previous_part = ''
        for part in parts:
            previous_part = previous_part + '/' + part
            categories.append((previous_part, part))

        for (path, category) in categories:
            if path in all_paths:
                all_paths[path][0].append(post)
            else:
                all_paths[path] = ([post], category)

    for path in all_paths:
        info = all_paths[path]
        make_list(info[0], dst, path, page_layout,
                  list_layout, item_layout, **params)


def make_list(posts, dst, path, page_layout, list_layout, item_layout, **params):
    """Generate list page for a blog."""
    items = []
    for post in posts:
        item_params = dict(params, **post)
        # OWN CODE
        if ('intro' in post):
            item_params['summary'] = post['intro']
        else:
            item_params['summary'] = truncate(post['content'])
        # END
        item = render_layout(item_layout, **item_params)
        items.append(item)

    params['content'] = ''.join(items)
    dst_path = render(dst + path + "/index.html", **params)
    page = render_layout(list_layout, **params)
    if page_layout is not None:
        params['content'] = page
        params['slug'] = path.lstrip("/")
        page = render_layout(page_layout, **params)

    log('Rendering list => {} ...', dst_path)
    fwrite(dst_path, page)


def build():
    # OWN CODE
    if not os.path.exists('_site'):
        os.mkdir('_site')
    # END

    # Create a new _site directory from scratch.
    if os.path.isdir('_site'):
        shutil.rmtree('_site')
    shutil.copytree('static', '_site')

    # OWN CODE
    if not os.path.exists('_site/assets'):
        os.mkdir('_site/assets')

    if not os.path.exists('_site/assets/css'):
        os.mkdir('_site/assets/css')

    sass.compile(dirname=('scss', '_site/assets/css'), output_style='compressed', source_map_contents=True)
    # END

    # Default parameters.
    params = {
        'base_path': '',
        'subtitle': 'Lorem Ipsum',
        'author': 'Admin',
        'intro': '',
        'site_url': 'https://www.tealpartners.com',
        #   'site_url': 'http://localhost:8000',
        'current_year': datetime.datetime.now().year
    }

    # If params.json exists, load it.
    if os.path.isfile('params.json'):
        params.update(json.loads(fread('params.json')))

    # Load layouts.
    page_layout_en = get_template('layout/en/page.html')
    page_layout_nl = get_template('layout/nl/page.html')
    post_layout_en = get_template('layout/en/post.html')
    post_layout_nl = get_template('layout/nl/post.html')
    list_layout = get_template('layout/list.html')
    item_layout_en = get_template('layout/en/item.html')
    item_layout_nl = get_template('layout/nl/item.html')

    # Create site pages.
    make_pages('content/_index.html', '_site/index.html',
               page_layout_en, post_layout_en, **params)
    make_pages('content/[!_]*.html', '_site/{{ slug }}/index.html',
               page_layout_nl, post_layout_en, **params)

    # Create blogs.
    blog_posts_en = make_pages('content/en/blog/**/*.md',
                            '_site/en/blog/{{ slug }}/index.html',
                            page_layout_en, post_layout_en, blog='en/blog', **params)
    blog_posts_nl = make_pages('content/nl/blog/**/*.md',
                            '_site/nl/blog/{{ slug }}/index.html',
                            page_layout_nl, post_layout_nl, blog='nl/blog', **params)

    make_category_pages(blog_posts_en, '_site/en/blog', page_layout_en,
                        list_layout, item_layout_en, blog='en/blog', title='Teal Partners Blog', **params)

    make_category_pages(blog_posts_nl, '_site/nl/blog', page_layout_nl,
                        list_layout, item_layout_nl, blog='nl/blog', title='Teal Partners Blog', **params)

    # Create blog list pages.
    make_list(blog_posts_en, '_site/en/blog', '', page_layout_en,
              list_layout, item_layout_en, blog='en/blog', title='Teal Partners Blog', **params)
    make_list(blog_posts_nl, '_site/nl/blog', '', page_layout_nl,
              list_layout, item_layout_nl, blog='nl/blog', title='Teal Partners Blog', **params)

# Test parameter to be set temporarily by unit tests.
_test = None

if __name__ == '__main__':
    build()
