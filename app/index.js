/**
 * Isomorphic Application
 */

import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

var store = createStore((state, action) => {
    switch (action.type) {
        case 'CHANGE_PAGE':
            return Object.assign({}, state, {
                activePage: action.activePage
            });
    }
    return state;
}, {
    activePage: 'page1',
    pages: [{
        id: 'page1',
        title: 'this is page 1'
    },{
        id: 'page2',
        title: 'this is page3'
    }]
});

function changePage(activePage) {
    return {
        type: 'CHANGE_PAGE',
        activePage
    }
}

class Page extends React.Component {
    static defaultProps = {
        id: 'page-x',
        title: 'page xxx'
    }
    render() {
        var { id, title } = this.props;
        return <div><h2>{id}</h2><p>{title}</p></div>;
    }
}

class ActivePage extends React.Component {
    static defaultProps = {
        activePage: null,
        pages: []
    }
    render() {
        var { activePage, pages } = this.props;
        var page = pages.filter(page => page.id === activePage).shift();
        if (page) {
            return <Page {...page} />
        } else {
            return <div>Page not found</div>;
        }
    }
}

class AppComponent extends React.Component {
    navigate = (e) => {
        e.preventDefault();
        var { dispatch } = this.props;
        var uri = e.target.href.split('/').pop();
        dispatch(changePage(uri));
    }
    render() {
        return (
            <div className="container">
                <p style={{marginTop:20}}>
                    <a href="/page1" onClick={this.navigate}>Page1</a>
                    <span> | </span>
                    <a href="/page2" onClick={this.navigate}>Page2</a>
                    <span> | </span>
                    <a href="/page3" onClick={this.navigate}>Page3</a>
                </p>
                <hr />
                <ActivePage {...this.props} />
            </div>
        );
    }
}

var App = connect(s => s)(AppComponent);


// client side startup
exports.start = function(initialState, fireBase) {
    var state = store.getState();
    React.render((
        <Provider store={store}>
            {$=> <App />}
        </Provider>
    ), document.getElementById('app'));
};

// server side rendering
exports.renderMarkup = function(initialState) {
    // return React.renderToString(<Page />);
};
