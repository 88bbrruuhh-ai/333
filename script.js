document.addEventListener('DOMContentLoaded', function() {
    const postContainer = document.getElementById('posts');
    const converter = new showdown.Converter();

    // --- Configuration ---
    // Automatically detects the repository from the GitHub Pages URL.
    // E.g., https://USER.github.io/REPO/ -> USER/REPO
    const repoPath = new URL(window.location.href).pathname.split('/').filter(Boolean);
    const GITHUB_USER = repoPath[0] || '88bbrruuhh-ai';
    const GITHUB_REPO = repoPath[1] || '333';
    const POSTS_DIR = '_posts';
    // --- End Configuration ---

    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${POSTS_DIR}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Posts directory not found in the repository. Make sure the path is correct and the repository is public.`);
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        })
        .then(files => {
            const postFiles = files.filter(file => file.name.endsWith('.md') || file.name.endsWith('.markdown'));

            if (postFiles.length === 0) {
                postContainer.innerHTML = `<p>No posts found in the repository. Please add your posts to the \`_posts\` directory.</p>`;
                return;
            }
            
            // Sort posts by filename (date) in descending order
            postFiles.sort((a, b) => b.name.localeCompare(a.name));

            postFiles.forEach(file => {
                fetch(file.download_url)
                    .then(response => response.text())
                    .then(text => {
                        const post = parseFrontmatter(text);
                        const postElement = document.createElement('article');
                        postElement.className = 'post';

                        const title = `<h2>${post.meta.title || 'Untitled Post'}</h2>`;
                        const date = post.meta.date ? `<div class="meta">Published on: ${new Date(post.meta.date).toLocaleDateString()}</div>` : '';
                        const body = converter.makeHtml(post.body);

                        postElement.innerHTML = title + date + body;
                        postContainer.appendChild(postElement);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postContainer.innerHTML = `<p>Error loading posts. ${error.message}. Please check the browser's developer console for more details.</p>`;
        });
});

function parseFrontmatter(text) {
    const frontmatterRegex = /^---([\s\S]*?)---/;
    const match = frontmatterRegex.exec(text);
    const meta = {};
    let body = text;

    if (match) {
        const frontmatter = match[1];
        body = text.substring(match[0].length).trim();
        frontmatter.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                if (key) meta[key] = value;
            }
        });
    }

    return { meta, body };
}
