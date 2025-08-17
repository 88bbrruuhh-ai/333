document.addEventListener("DOMContentLoaded", function() {
    const postsContainer = document.getElementById("posts");
    const converter = new showdown.Converter();

    // This is a placeholder. In a real-world scenario, you would fetch the list of posts.
    // For this example, we assume you have a way to know the filenames of your posts.
    // You would typically use the GitHub API if your posts are in a public repo.
    const postFiles = [
        // Example: '_posts/2023-01-01-my-first-post.md'
        // This array should be populated dynamically in a real application
    ];

    if (postFiles.length === 0) {
        postsContainer.innerHTML = '<p>No posts found. Please add your posts to the `_posts` directory and update `script.js`.</p>';
        return;
    }

    postFiles.forEach(file => {
        fetch(file)
            .then(response => response.text())
            .then(text => {
                const post = parseFrontMatter(text);
                const postElement = document.createElement("article");
                postElement.className = "post";
                postElement.innerHTML = `
                    <h2>${post.attributes.title}</h2>
                    <p><em>${new Date(post.attributes.date).toLocaleDateString()}</em></p>
                    <div>${converter.makeHtml(post.body)}</div>
                `;
                postsContainer.appendChild(postElement);
            })
            .catch(error => console.error('Error fetching post:', error));
    });

    function parseFrontMatter(markdown) {
        const match = /---\n([\s\S]+?)\n---/.exec(markdown);
        const frontMatter = match[1];
        const body = markdown.substring(match[0].length);

        const attributes = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...value] = line.split(':');
            if (key) {
                attributes[key.trim()] = value.join(':').trim();
            }
        });

        return { attributes, body };
    }
});

