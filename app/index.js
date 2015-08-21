/**
 * Isomorphic Application
 */

import React from 'react';
import { createStore } from 'redux';

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


// client side startup
exports.start = function(initialState, fireBase) {
    var state = store.getState();
    React.render(<ActivePage {...state} />, document.getElementById('app'));
};

// server side rendering
exports.renderMarkup = function(initialState) {
    // return React.renderToString(<Page />);
};
