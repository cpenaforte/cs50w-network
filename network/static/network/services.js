import models from './models.js';

const getPost = async (id) => {
    try {
        const response = await fetch(`/api/v1/posts/${id}`);

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

const getAllPosts = async (perPage=10, page=1) => {
    try {
        const path = `api/v1/posts?per_page=${perPage}&page=${page}`
        const response = await fetch(path);

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        const data = await response.json();

        models.postsTotalNumber = data.total_posts;
        models.postsPage = data.page;
        models.postsTotalPages = data.total_pages;
        models.postsHasNext = data.has_next;
        models.postsHasPrevious = data.has_previous;

        return data.posts || data;
    } catch (error) {
        console.error(error);
    }
};

const getFollowingPosts = async (perPage=10, page=1) => {
    try {
        const path = `api/v1/posts/following?per_page=${perPage}&page=${page}`
        const response = await fetch(path);

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        const data = await response.json();

        models.postsTotalNumber = data.total_posts;
        models.postsPage = data.page;
        models.postsTotalPages = data.total_pages;
        models.postsHasNext = data.has_next;
        models.postsHasPrevious = data.has_previous;

        return data.posts;
    } catch (error) {
        console.error(error);
    }
};

const createPost = async (content) => {
    try {
        const response = await fetch(`/api/v1/posts`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });

        if (response.status !== 201) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }

};

const updatePost = async (id, content) => {
    try {
        const response = await fetch(`/api/v1/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ content })
        });

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

const likePost = async (id, isLike) => {
    try {
        const response = await fetch(`/api/v1/posts/${id}/like`, {
            method: 'PUT',
            body: JSON.stringify({ like: isLike })
        });

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

const deletePost = async (id) => {
    try {
        const response = await fetch(`/api/v1/posts/${id}`, {
            method: 'DELETE'
        });

        if (response.status !== 204) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(error);

        return false;
    }
};

const createComment = async (postId, content) => {
    try {
        const response = await fetch(`/api/v1/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });

        if (response.status !== 201) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

const updateComment = async (postId, commentId, content) => {
    try {
        const response = await fetch(`/api/v1/posts/${postId}/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({ content })
        });

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

const deleteComment = async (postId, commentId) => {
    try {
        const response = await fetch(`/api/v1/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE'
        });

        if (response.status !== 204) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(error);

        return false;
    }
};

const getProfile = async (perPage=10, page=1) => {
    try {
        const path = `/api/v1/profile?per_page=${perPage}&page=${page}`;

        const response = await fetch(path);

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        const data = await response.json();

        models.postsTotalNumber = data.total_posts;
        models.postsPage = data.page;
        models.postsTotalPages = data.total_pages;
        models.postsHasNext = data.has_next;
        models.postsHasPrevious = data.has_previous;

        return data.user || data;
    } catch (error) {
        console.error(error);
    }
};

const getUser = async (username, perPage=10, page=1) => {
    try {
        const path = `/api/v1/users/${username}?per_page=${perPage}&page=${page}`;
        const response = await fetch(path);

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        const data = await response.json();

        models.postsTotalNumber = data.total_posts;
        models.postsPage = data.page;
        models.postsTotalPages = data.total_pages;
        models.postsHasNext = data.has_next;
        models.postsHasPrevious = data.has_previous;

        return data.user;
    } catch (error) {
        console.error(error);
    }
}

const follow = async (username, isFollow) => {
    try {
        const response = await fetch(`/api/v1/users/${username}/follow`, {
            method: 'PUT',
            body: JSON.stringify({ follow: isFollow })
        });

        if (response.status !== 200) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
}

export default {
    getPost,
    getAllPosts,
    createPost,
    updatePost,
    likePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
    getFollowingPosts,
    getProfile,
    getUser,
    follow
};