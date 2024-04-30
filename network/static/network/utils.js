import templates from './templates.js';
import services from './services.js';
import models from './models.js';

const insertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

const pushStateTrigger = (state, url) => {
    window.history.pushState(state, '', url);

    const popStateEvent = new PopStateEvent('popstate', { state: state });
    dispatchEvent(popStateEvent);
}

const applyProfilePaginationActions = () => {
    const btnPrevious = document.querySelector('#btn-previous');
    const btnNext = document.querySelector('#btn-next');

    if (btnPrevious) {
        document.querySelector('#btn-previous').onclick = async () => {
            const page = models.postsPage - 1;

            updateProfilePosts(page);
        };
    }

    if (btnNext) {
        document.querySelector('#btn-next').onclick = async () => {
            const page = models.postsPage + 1;

            updateProfilePosts(page);
        };
    }
};

const updateProfilePosts = async (page) => {
    const user = await services.getProfile(10, page);

    const profilePosts = document.querySelector('#el-profile-posts');
    profilePosts.innerHTML = `
        <h4>Posts</h4>
        ${(user.posts?.length)
            ? user.posts.map(post => templates.postTemplate(post)).join('').concat(templates.paginationTemplate())
            : '<p class="text-center">No posts yet.</p>'
        }
    `;

    applyProfilePaginationActions();

    basePostsEvents();

    const app = document.querySelector('#app');
    app?.scrollTo(0, 0);
};


const profileViewPaginated = async (page) => {
    try {
        const app = document.querySelector('#app');

        const user = await services.getProfile(10, page);

        app.innerHTML = templates.profileTemplate(user);

        document.querySelectorAll('.post-username').forEach(btn => {
            btn.onclick = () => clickedUsername(btn);
        });

        basePostsEvents();
        
        applyProfilePaginationActions();

        const followBtn = document.querySelector('#btn-follow');

        if (!followBtn) return;

        followBtn.onclick = () => clickedFollowBtn(followBtn);
    } catch(error) {
        console.error(error);
        app.innerHTML = templates.profileTemplate({});
    };
};

const applyUserPaginationActions = (username) => {
    const btnPrevious = document.querySelector('#btn-previous');
    const btnNext = document.querySelector('#btn-next');

    if (btnPrevious) {
        document.querySelector('#btn-previous').onclick = async () => {
            const page = models.postsPage - 1;

            updateUserPosts(username, page);
        };
    }

    if (btnNext) {
        document.querySelector('#btn-next').onclick = async () => {
            const page = models.postsPage + 1;

            updateUserPosts(username, page);
        };
    }
};

const updateUserPosts = async (username, page) => {
    const user = await services.getUser(username, 10, page);

    const userPosts = document.querySelector('#el-profile-posts');
    userPosts.innerHTML = `
        <h4>Posts</h4>
        ${(user.posts?.length)
            ? user.posts.map(post => templates.postTemplate(post)).join('').concat(templates.paginationTemplate())
            : '<p class="text-center">No posts yet.</p>'
        }
    `;

    applyUserPaginationActions(username);

    basePostsEvents();

    const app = document.querySelector('#app');
    app?.scrollTo(0, 0);
};

const userViewPaginated = async (username, page = 1) => {
    try {
        const app = document.querySelector('#app');

        const user = await services.getUser(username, 10, page);

        app.innerHTML = templates.profileTemplate(user);

        document.querySelectorAll('.post-username').forEach(btn => {
            btn.onclick = () => clickedUsername(btn);
        });

        basePostsEvents();

        applyUserPaginationActions(username);

        const followBtn = document.querySelector('#btn-follow');

        if (!followBtn) return;

        followBtn.onclick = () => clickedFollowBtn(followBtn);
    } catch(error) {
        console.error(error);
        app.innerHTML = templates.profileTemplate({});
    };
};

const applyFollowingPaginationActions = () => {
    const btnPrevious = document.querySelector('#btn-previous');
    const btnNext = document.querySelector('#btn-next');

    if (btnPrevious) {
        document.querySelector('#btn-previous').onclick = async () => {
            const page = models.postsPage - 1;

            updateFollowingPosts(page);
        };
    }

    if (btnNext) {
        document.querySelector('#btn-next').onclick = async () => {
            const page = models.postsPage + 1;

            updateFollowingPosts(page);
        };
    }
};

const updateFollowingPosts = async (page) => {
    const posts = await services.getFollowingPosts(10, page);

    const followingPosts = document.querySelector('#el-following-posts');
    followingPosts.innerHTML = `
        <h4>Following</h4>
        ${(posts?.length)
            ? posts.map(post => templates.postTemplate(post)).join('').concat(templates.paginationTemplate())
            : '<p class="text-center">No posts yet.</p>'
        }
    `;

    applyFollowingPaginationActions();

    basePostsEvents();

    const app = document.querySelector('#app');
    app?.scrollTo(0, 0);
};

const followingViewPaginated = async (page = 1) => {
    try {
        const app = document.querySelector('#app');

        const posts = await services.getFollowingPosts(10, page);
        app.innerHTML = templates.followingPostsTemplate(posts);
    
        basePostsEvents();

        applyFollowingPaginationActions();
    } catch(error) {
        console.error(error);
        app.innerHTML = templates.followingPostsTemplate([]);
    };
};

const applyPostsPaginationActions = () => {
    const btnPrevious = document.querySelector('#btn-previous');
    const btnNext = document.querySelector('#btn-next');

    if (btnPrevious) {
        document.querySelector('#btn-previous').onclick = async () => {
            const page = models.postsPage - 1;

            updatePosts(page);
        };
    }

    if (btnNext) {
        document.querySelector('#btn-next').onclick = async () => {
            const page = models.postsPage + 1;

            updatePosts(page);
        };
    }
};

const updatePosts = async (page) => {
    const posts = await services.getAllPosts(10, page);

    const followingPosts = document.querySelector('#el-all-posts');
    followingPosts.innerHTML = `
        <h4>Following</h4>
        ${(posts?.length)
            ? posts.map(post => templates.postTemplate(post)).join('').concat(templates.paginationTemplate())
            : '<p class="text-center">No posts yet.</p>'
        }
    `;

    applyPostsPaginationActions();

    basePostsEvents();
    
    const app = document.querySelector('#app');
    app?.scrollTo(0, 0);
};

const postsViewPaginated = async (page = 1) => {
    const app = document.querySelector('#app');
    app.innerHTML = templates.allPostsTemplate([]);

    try {
        const posts = await services.getAllPosts(10, page);
        
        models.currentUsername = app.dataset.username;
        app.innerHTML = templates.allPostsTemplate(posts);
        
        document.querySelector('#btn-new-post').onclick = () => {
            document.querySelector('#invalid-feedback').innerHTML = '';
    
            const content = document.querySelector('#post-content').value;
    
            if (!content) {
                document.querySelector('#invalid-feedback').innerHTML = 'Content is required.';
    
                return;
            }
    
            services.createPost(content).then(post => {
                document.querySelector('#post-content').value = '';

                const feedHeader = document.querySelector('#el-all-posts > h4');

                const newPost = createElementUsingTemplate(templates.postTemplate(post));

                const likeBtn = newPost.querySelector('.like-btn');
                likeBtn.onclick = () => clickedLikeBtn(likeBtn);
                
                insertAfter(feedHeader, newPost);

                basePostsEvents();
            }).catch(error => {
                console.error(error);
                document.querySelector('#invalid-feedback').innerHTML = error.message || 'An error has occured. Please try again.';
            });
        };

        basePostsEvents();

        applyPostsPaginationActions();
    } catch (error) {
        console.error(error);
        document.querySelector('#app').innerHTML = templates.allPostsTemplate([]);
    }
};

const basePostsEvents = () => {
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.onclick = () => clickedLikeBtn(btn);
    });

    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.onclick = () => clickedCommentBtn(btn);
    });

    document.querySelectorAll('.btn-new-comment').forEach(btn => {
        btn.onclick = () => {
            btn.parentNode.querySelector('.comment-invalid-feedback').innerHTML = '';

            const content = btn.parentNode.querySelector('.comment-content').value;

            if (!content) {
                btn.parentNode.querySelector('.comment-invalid-feedback').innerHTML = 'Content is required.';

                return;
            }

            const postid = btn.dataset.postid;

            services.createComment(postid, content).then(receivedComment => {
                btn.parentNode.querySelector('.comment-content').value = '';

                const comments = btn.parentNode.parentNode;

                const newComment = createElementUsingTemplate(templates.commentTemplate(postid, receivedComment));

                const commentsContainer = comments.querySelector('.comment-list');

                commentsContainer.querySelector('.no-comment')?.remove();

                commentsContainer.insertBefore(newComment, commentsContainer.firstChild);

                basePostsEvents();
            }).catch(error => {
                console.error(error);
                btn.parentNode.querySelector('.comment-invalid-feedback').innerHTML = error.message || 'An error has occured. Please try again.';
            });
        };
    });

    document.querySelectorAll('.btn-delete-post').forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;

            services.deletePost(id).then((result) => {
                if (!result) {
                    throw new Error('An error has occured. Please try again.');
                }

                btn.parentNode.parentNode.parentNode.parentNode.remove();
            }).catch(error => {
                console.error(error);
                document.querySelector('#invalid-feedback').innerHTML = error.message || 'An error has occured. Please try again.';
            });
        };
    });

    document.querySelectorAll('.btn-edit-post').forEach(btn => {
        btn.onclick = () => {
            clickedEditPostBtn(btn);
        };
    });

    document.querySelectorAll('.btn-update-post').forEach(btn => {
        btn.onclick = () => {
            btn.parentNode.parentNode.querySelector('.post-invalid-feedback').innerHTML = '';

            const content = btn.parentNode.parentNode.querySelector('.post-content-edited').value;

            if (!content) {
                btn.parentNode.parentNode.querySelector('.post-invalid-feedback').innerHTML = 'Content is required.';

                return;
            }

            const id = btn.dataset.id;

            services.updatePost(id, content).then(post => {
                const postContent = btn.parentNode.parentNode.parentNode.parentNode.querySelector('.post-content');
                const postEdit = btn.parentNode.parentNode.parentNode.parentNode.querySelector('.post-edit');

                postContent.querySelector('.post-content-text').innerHTML = post.content;
                postEdit.querySelector('.post-content-edited').value = post.content;

                postContent.classList.replace('d-none', 'd-flex');
                postEdit.classList.replace('d-flex', 'd-none');
            }).catch(error => {
                console.error(error);
                btn.parentNode.parentNode.querySelector('.post-invalid-feedback').innerHTML = error.message || 'An error has occured. Please try again.';
            });
        };
    });

    document.querySelectorAll('.btn-delete-comment').forEach(btn => {
        btn.onclick = () => {
            const postId = btn.dataset.postid;
            const commentId = btn.dataset.commentid;

            services.deleteComment(postId, commentId).then((result) => {
                if (!result) {
                    throw new Error('An error has occured. Please try again.');
                }

                btn.parentNode.parentNode.parentNode.parentNode.remove();
            }).catch(error => {
                console.error(error);
                document.querySelector('#invalid-feedback').innerHTML = error.message || 'An error has occured. Please try again.';
            });
        };
    });

    document.querySelectorAll('.btn-edit-comment').forEach(btn => {
        btn.onclick = () => clickedEditCommentBtn(btn);
    });

    document.querySelectorAll('.btn-update-comment').forEach(btn => {
        btn.onclick = () => {
            btn.parentNode.parentNode.querySelector('.comment-invalid-feedback').innerHTML = '';

            const content = btn.parentNode.parentNode.querySelector('.comment-content-edited').value;

            if (!content) {
                btn.parentNode.parentNode.querySelector('.comment-invalid-feedback').innerHTML = 'Content is required.';

                return;
            }

            const postId = btn.dataset.postid;
            const commentId = btn.dataset.commentid;

            services.updateComment(postId, commentId, content).then(comment => {
                const commentContent = btn.parentNode.parentNode.parentNode.parentNode.querySelector('.comment-content');
                const commentEdit = btn.parentNode.parentNode.parentNode.parentNode.querySelector('.comment-edit');

                commentContent.querySelector('.comment-content-text').innerHTML = comment.content;
                commentEdit.querySelector('.comment-content-edited').value = comment.content;

                commentContent.classList.replace('d-none', 'd-flex');
                commentEdit.classList.replace('d-flex', 'd-none');
            }).catch(error => {
                console.error(error);
                btn.parentNode.parentNode.querySelector('.comment-invalid-feedback').innerHTML = error.message || 'An error has occured. Please try again.';
            });
        };
    });

    document.querySelectorAll('.post-username').forEach(btn => {
        btn.onclick = () => clickedUsername(btn);
    });
}

const createElementUsingTemplate = (template) => {
    const div = document.createElement('div');
    div.innerHTML = template.trim();
    return div.firstChild;
}

const clickedLikeBtn = (btn) => {
    const id = btn.dataset.id;
    const islike = btn.dataset.islike === 'true';

    services.likePost(id, islike).then(post => {
        btn.dataset.islike = `${!post.liked}`;
        btn.innerHTML = `
            ${post.liked ? templates.likedIcon() : templates.notLikedIcon()}
            <span class="ml-0">${post.likes}</span>
        `;
    }).catch(error => {
        console.error(error);
        document.querySelector('#invalid-feedback').innerHTML = error.message || 'An error has occured. Please try again.';
    });
}

const clickedCommentBtn = (btn) => {
    const comments = btn.parentNode.parentNode.querySelector('.comments');

    comments.classList.contains('d-flex')
        ? comments.classList.replace('d-flex', 'd-none')
        : comments.classList.add('d-none', 'd-flex');
}

const clickedEditPostBtn = (btn) => {
    const post = btn.parentNode.parentNode.parentNode;

    const postContent = post.querySelector('.post-content');
    const postEdit = post.querySelector('.post-edit');

    postContent.classList.replace('d-flex', 'd-none');
    postEdit.classList.replace('d-none', 'd-flex');

    postEdit.querySelector('.btn-edit-post-cancel').onclick = () => {
        postContent.classList.replace('d-none', 'd-flex');
        postEdit.classList.replace('d-flex', 'd-none');
    };
};

const clickedEditCommentBtn = (btn) => {
    const comment = btn.parentNode.parentNode.parentNode;

    const commentContent = comment.querySelector('.comment-content');
    const commentEdit = comment.querySelector('.comment-edit');

    commentContent.classList.replace('d-flex', 'd-none');
    commentEdit.classList.replace('d-none', 'd-flex');

    commentEdit.querySelector('.btn-edit-comment-cancel').onclick = () => {
        commentContent.classList.replace('d-none', 'd-flex');
        commentEdit.classList.replace('d-flex', 'd-none');
    };
};

const clickedFollowBtn = (btn) => {
    const isFollow = btn.dataset.isfollow === 'true';

    services.follow(btn.dataset.username, isFollow).then(user => {
        btn.dataset.isfollow = `${!isFollow}`;
        btn.parentNode.parentNode.querySelector("#el-followers-count").innerHTML = user.followers.length;
        btn.parentNode.parentNode.querySelector("#el-following-count").innerHTML = user.following.length;
        
        if (isFollow) {
            btn.className = btn.className.replace('btn-primary', 'btn-outline-primary');

            btn.innerHTML = 'Unfollow';

            return;
        }
        
        btn.className = btn.className.replace('btn-outline-primary', 'btn-primary');

        btn.innerHTML = 'Follow';
    }).catch(error => {
        console.error(error);
    })

}

const clickedUsername = (btn) => {
    const username = `${btn.innerHTML}`.replace('@', '');

    if (username === models.currentUsername) {
        pushStateTrigger({view: 'profile'}, '/profile');

        return;
    }

    pushStateTrigger({view: 'user', username }, `/users/${username}`);
};

const loadUserView = async (username) => {
    await userViewPaginated(username, 1);
};


const loadPostsView = async () => {
    await postsViewPaginated(1);
}

const loadFollowingPostsView = async () => {
    const app = document.querySelector('#app');
    app.innerHTML = templates.followingPostsTemplate([]);

    try {
        const posts = await services.getFollowingPosts(10, 1);
        
        models.currentUsername = app.dataset.username;
        app.innerHTML = templates.followingPostsTemplate(posts);

        basePostsEvents();

        const btnPrevious = document.querySelector('#btn-previous');
        const btnNext = document.querySelector('#btn-next');

        if (btnPrevious) {
            document.querySelector('#btn-previous').onclick = () => {
                const page = models.postsPage - 1;

                followingViewPaginated(page);
            };
        }

        if (btnNext) {
            document.querySelector('#btn-next').onclick = () => {
                const page = models.postsPage + 1;

                followingViewPaginated(page)
            };
        }
    } catch (error) {
        console.error(error);
        document.querySelector('#app').innerHTML = templates.followingPostsTemplate([]);
    }
}

const loadProfileView = async () => {
    const app = document.querySelector('#app');
    app.innerHTML = templates.profileTemplate({});

    await profileViewPaginated(1);
}

export default {
    loadPostsView,
    loadProfileView,
    loadFollowingPostsView,
    pushStateTrigger,
    loadUserView
}