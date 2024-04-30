import models from './models.js';

const notLikedIcon = () => {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
        </svg>
    `;
};

const likedIcon = () => {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
        </svg>
    `;
};

const paginationTemplate = () => {
    return `
        <nav style="align-self: end;">
            <ul class="pagination">
                ${ models.postsHasPrevious
                    ? `
                        <li class="page-item">
                            <button id="btn-previous" class="nav-btn page-link">
                                <span style="font-size: 22px;">&laquo;</span>
                            </button>
                        </li>
                    `
                    : ''
                }
                ${ models.postsHasNext
                    ? `
                        <li class="page-item">
                            <button id="btn-next" class="nav-btn page-link">
                                <span style="font-size: 22px;">&raquo;</span>
                            </button>
                        </li>
                    `
                    : ''
                }
            </ul>
        </nav>
    `;
};

const commentTemplate = (postId, comment) => {
    return `
        <div class="card">
            <div class="card-body">
                <div class="card-title d-flex align-items-center justify-content-between">
                    <button class="comment-username btn btn-sm p-0 text-primary">@${comment.user}</button>
                    ${ comment.user === models.currentUsername
                        ? `
                            <div class="comment-actions d-flex align-items-center"
                                style="gap: 8px;"
                            >
                                <button class="btn btn-outline-primary btn-sm btn-edit-comment">Edit</button>
                                <button class="btn btn-outline-danger btn-sm btn-delete-comment" data-postid="${postId}" data-commentid="${comment.id}">Delete</button>
                            </div>
                        `
                        : ''
                    }
                </div>
                <div class="comment-content card-text d-flex flex-column">
                    <p class="comment-content-text">${comment.content}</p>
                    <p class="comment-content-timestamp text-secondary">${comment.timestamp}</p>
                </div>
                <div class="comment-edit d-none flex-column">
                    <div class="form-group">
                        <textarea class="form-control comment-content-edited" rows="3" placeholder="What's on your mind?">${comment.content}</textarea>
                        <div class="comment-invalid-feedback text-danger"></div>
                        <div class="update-comment-actions d-flex mt-2" style="gap: 8px;">
                            <button class="btn-edit-comment-cancel btn btn-sm btn-outline-secondary">Cancel</button>
                            <button
                                class="btn-update-comment btn btn-sm btn-primary"
                                data-postid="${postId}"
                                data-commentid="${comment.id}"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const commentBoxTemplate = (postId, comments) => {
    return `
        <div class="comments d-none flex-column mt-2" style="gap: 16px;">
            <div class="form-group">
                <textarea class="form-control comment-content" rows="3" placeholder="Write your comment"></textarea>
                <div class="comment-invalid-feedback text-danger"></div>
                <button class="btn-new-comment btn btn-primary mt-2"
                    data-postid="${postId}"
                >
                    Comment
                </button>
            </div>
            <div class="comment-list d-flex flex-column" style="gap: 16px;">
                ${(comments?.length) 
                    ? (comments.map(comment => commentTemplate(postId, comment)).join('')
                    )
                    : '<p class="text-center no-comment">No comments yet.</p>'
                }
            </div>
        </div>
    `;
}

const postTemplate = (post) => {
    return `
        <div class="card">
            <div class="card-body">
                <div class="card-title d-flex align-items-center justify-content-between">
                    <button class="post-username btn btn-sm p-0 text-primary">@${post.user}</button>
                    ${ post.is_owner
                        ? `
                            <div class="post-actions d-flex align-items-center"
                                style="gap: 8px;"
                            >
                                <button class="btn btn-outline-primary btn-sm btn-edit-post" data-id="${post.id}">Edit</button>
                                <button class="btn btn-outline-danger btn-sm btn-delete-post" data-id="${post.id}">Delete</button>
                            </div>
                        `
                        : ''
                    }
                    
                </div>
                <div class="card-text d-flex flex-column">
                    <div class="post-content d-flex flex-column">
                        <p class="post-content-text p-0 m-0 mb-1">${post.content}</p>
                        <p class="post-content-timestamp p-0 m-0 text-secondary">${post.timestamp}</p>
                    </div>
                    <div class="post-edit d-none flex-column">
                        <div class="form-group">
                            <textarea class="form-control post-content-edited" rows="3" placeholder="What's on your mind?">${post.content}</textarea>
                            <div class="post-invalid-feedback text-danger"></div>
                            <div class="update-post-actions d-flex mt-2" style="gap: 8px;">
                                <button class="btn-edit-post-cancel btn btn-sm btn-outline-secondary">Cancel</button>
                                <button class="btn-update-post btn btn-sm btn-primary" data-id="${post.id}">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="action-row d-flex align-items-center m-0 p-0">
                        <button class="like-btn btn btn-icon text-danger mr-3 p-0" data-id="${post.id}" data-islike="${!post.liked}">
                            ${post.liked ? likedIcon() : notLikedIcon()}
                            <span class="ml-0">${post.likes}</span>
                        </button>
                        <button class="comment-btn btn btn-outline-secondary btn-sm">Comments</button>
                    </div>
                    ${commentBoxTemplate(post.id, post.comments)}
                </div>
            </div>
        </div>
    `;
}

const newPostTemplate = () => {
    return `
        <div class="card border-0" style="background-color: rgba(200,200,200,0.1);">
            <div class="card-body">
                <div class="card-title">
                    <h5>New Post</h5>
                </div>
                <div class="card-text">
                    <div class="form-group">
                        <textarea class="form-control" id="post-content" rows="3" placeholder="What's on your mind?"></textarea>
                        <div id="invalid-feedback"></div>
                        <button id="btn-new-post" class="btn btn-primary mt-2">Post</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}



const allPostsTemplate = (posts) => {
    return `
        <div class="d-flex flex-column" style="gap: 16px;">
            ${newPostTemplate()}
            <div id="el-all-posts" class="d-flex flex-column px-4" style="gap: 16px;">
                <h4>Feed</h4>
                ${(posts?.length)
                    ? posts.map(post => postTemplate(post)).join('').concat(paginationTemplate())
                    : '<p class="text-center">No posts yet.</p>'
                }
            </div>
        </div>
    `;
}

const followingPostsTemplate = (posts) => {
    return `
        <div id="el-following-posts" class="d-flex flex-column px-4 mt-4" style="gap: 16px;">
            <h4>Following</h4>
            ${(posts?.length)
                ? posts.map(post => postTemplate(post)).join('').concat(paginationTemplate())
                : '<p class="text-center">No posts yet.</p>'
            }
        </div
    `;
}

const profileTemplate = (user) => {
    if (!user?.id) return '<p class="text-center">User not found.</p>';
    const following = user.followers.filter(following => following === models.currentUsername).length > 0;

    return `
        <div class="d-flex flex-column" style="gap: 16px;">
            <div class="card m-4 p-4">
                <div class="card-title d-flex align-items-center" style="gap:16px;">
                    <h5 class="align-middle font-weight-bold m-0">${user.username}</h5>
                    ${ !user.is_owner 
                        ? `
                            <button 
                                id="btn-follow"
                                class="btn btn-sm ${following ? 'btn-outline-primary' : 'btn-primary' }"
                                data-isfollow="${!following}"
                                data-username="${user.username}"
                            >
                                ${following ? 'Unfollow' : 'Follow'}
                            </button>
                        `
                        : ''
                    }
                </div>
                <div class="card-body">
                    <div class="card-text">
                        <div class="d-flex flex-column">
                            <div class="d-flex align-items-center">
                                <span class="mr-2">Followers:</span>
                                <span id="el-followers-count">${user.followers.length}</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="mr-2">Following:</span>
                                <span id="el-following-count">${user.following.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="el-profile-posts" class="d-flex flex-column px-4" style="gap: 16px;">
                <h4>Posts</h4>
                ${(user.posts?.length)
                    ? user.posts.map(post => postTemplate(post)).join('').concat(paginationTemplate())
                    : '<p class="text-center">No posts yet.</p>'
                }
            </div>
        </div>
    `;
}


export default {
    allPostsTemplate,
    postTemplate,
    newPostTemplate,
    likedIcon,
    notLikedIcon,
    commentBoxTemplate,
    commentTemplate,
    profileTemplate,
    followingPostsTemplate,
    paginationTemplate
}