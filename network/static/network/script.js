import utils from './utils.js'
import models from './models.js'


document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('popstate', (event) => {
        const state = event.state;

        switch (state.view) {
            case 'feed':
                utils.loadPostsView();
                break;
            case 'profile':
                utils.loadProfileView();
                break;
            case 'following':
                utils.loadFollowingPostsView();
                break;
            case 'user':
                utils.loadUserView(state.username);
                break;
            default:
                break;
        } 
    });

    const app = document.querySelector('#app');
    if (app?.dataset.isauthenticated === 'True') {
        models.currentUsername = app.dataset.username;

        switch (app.dataset.initpath) {
            case '/':
                utils.pushStateTrigger({view: 'feed'}, '/');
                break;
            case '/profile':
                utils.pushStateTrigger({view: 'profile'}, '/profile');
                break;
            case '/following':
                utils.pushStateTrigger({view: 'following'}, '/following');
                break;
            default:
                const username = app.dataset.initpath.split('/')[2];
                utils.pushStateTrigger({view: 'user', username }, app.dataset.initpath);
                break;
        }
    }

    document.querySelector('#btn-brand').addEventListener('click', (event) => {
        const target = event.target;

        if (target.dataset.isauthenticated === 'True') {
            models.currentUsername = target.dataset.username;
            utils.pushStateTrigger({view: 'feed'}, '/');
        }
    });

    document.querySelector('#btn-profile').addEventListener('click', () => {
        utils.pushStateTrigger({view: 'profile'}, '/profile');
    });

    document.querySelector('#btn-all-posts').addEventListener('click', () => {
        utils.pushStateTrigger({view: 'feed'}, '/');
    });

    document.querySelector('#btn-following').addEventListener('click', () => {
        utils.pushStateTrigger({view: 'following'}, '/following');
    });
});

