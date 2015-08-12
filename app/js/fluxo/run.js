
var React = require('react');
var Fluxo = require('fluxo');

var name = Fluxo.createAction('name', 'Luke');
var surname = Fluxo.createAction('surname', 'Skywalker');

var fullName = Fluxo.createComputedAction('full-name', function() {
    return name() + ' ' + surname();
});

var loadPostsSuccess = Fluxo.createAction('load-posts-success');
var loadPostsFailed = Fluxo.createAction('load-posts-failed');
var loadPostsDone = Fluxo.createAction('load-posts-done');

Fluxo.createAction('load-posts', function() {
    setTimeout($=> {
        loadPostsSuccess.fire(['post1','post2']);
        loadPostsDone.fire();
    }, 1000);
});

var myStore = Fluxo.createStore({

    getInitialState: function() {
        return {
            name: fullName.value(),
            posts: [],
            isLoading: false
        };
    },

    actions: [
        'full-name',
        'load-posts',
        'load-posts-done',
        'load-posts-success'
    ],

    onFullName(value) {
        this.setState({
            name: value
        });
    },

    onLoadPosts() {
        this.setState({isLoading: true});
    },

    onLoadPostsDone() {
        this.setState({isLoading: false});
    },

    onLoadPostsSuccess(posts) {
        this.setState({posts: posts});
    },
});

var ExampleComponent = React.createClass({

    mixins: [myStore.componentMixin()],

    onClick() {
        Fluxo.fire('name', 'Darth');
        Fluxo.fire('surname', 'Vader');
    },

    loadPosts() {
        console.log('fire load posts');
        Fluxo.fire('load-posts');
    },

    render() {
        var posts = this.state.posts.map(post => <li key={post}>{post}</li>);
        return (
            <div>
                <p>{this.state.name}</p>
                <button onClick={this.onClick}>turn to the dark side</button>
                <button onClick={this.loadPosts}>load posts</button>
                <p>IsLoading: <b>{this.state.isLoading.toString()}</b></p>
                <ul>{posts}</ul>
            </div>
        );
    }
});

React.render(<ExampleComponent />, document.getElementById('app'));
