document.addEventListener('DOMContentLoaded', function() {
    const postContainer = document.getElementById('posts');
    const converter = new showdown.Converter();

    // Add your post filenames here
    const postFiles = [
        '_posts/2025-08-17-test.md'
    ];

    if (postFiles.length === 0) {
        postContainer.innerHTML = `<p>No posts found. Please add your posts to the \`_posts\` directory and update \`script.js\`.</p>`;
        return;
    }

    postFiles.forEach(file => {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${file}`);
                }
                return response.text();
            })
            .then(text => {
                const post = parseFrontmatter(text);
                const postElement = document.createElement('article');
                postElement.className = 'post';

                const title = `<h2>${post.meta.title || 'Untitled Post'}</h2>`;
                const date = post.meta.date ? `<div class="meta">Published on: ${new Date(post.meta.date).toLocaleDateString()}</div>` : '';
                const body = converter.makeHtml(post.body);

                postElement.innerHTML = title + date + body;
                postContainer.appendChild(postElement);
            })
            .catch(error => {
                console.error('Error fetching or processing post:', file, error);
                const errorElement = document.createElement('article');
                errorElement.className = 'post';
                errorElement.innerHTML = `<h2>Error loading post: ${file}</h2><p>${error.message}</p>`;
                postContainer.appendChild(errorElement);
            });
    });
});

function parseFrontmatter(text) {
    const frontmatterRegex = /^---([\s\S]*?)---/;
    const match = frontmatterRegex.exec(text);

    const meta = {};
    let body = text;

    if (match) {
        const frontmatter = match[1];
        body = text.substring(match[0].length);

        frontmatter.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                if (key) {
                    meta[key] = value;
                }
            }
        });
    }

    return { meta, body };
}
