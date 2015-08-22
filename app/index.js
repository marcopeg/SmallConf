import React from 'react';
// import ReactDOM from 'react-dom';

import { Router, Route } from 'react-router';

import { createStore } from 'redux';
import { connect } from 'react-redux';
import { routerStateReducer, reduxRouteComponent, transitionTo } from 'redux-react-router';
import { LOCATION_DID_CHANGE } from 'redux-react-router/lib/actionTypes';



function appReducer(state, action) {
    return {...state,
        router: routerStateReducer(state.router, action)
    };
}

function changePage(activePage) {
    return {
        type: LOCATION_DID_CHANGE,
        payload: {
            pathname: '/' + activePage
        }
    }
}

class Page extends React.Component {
    static defaultProps = {
        id: 'page-x',
        title: 'page xxx'
    }
    render() {
        var { id, title } = this.props;
        return (
            <div>
                <h2>{title}</h2>
                <p><small>id - {id}</small></p>
            </div>
        );
    }
}

class ActivePage extends React.Component {
    static defaultProps = {
        activePage: 'home',
        pages: []
    }
    render() {
        var { activePage, pages } = this.props;
        var page = pages.filter(page => page.id === activePage).shift();
        
        if (page) {
            return <Page {...page} />;
        } else {
            return <div>Page not found: {activePage}!</div>;
        }
    }
}

class RouteInfo extends React.Component {
    render() {
        return <div>{this.props.params.pageId}</div>
    }
}

class Menu extends React.Component {
    static defaultProps = {
        onClick: null
    };
    render() {
        var { onClick } = this.props;
        return (
            <p style={{marginTop:20}}>
                <a href="/" onClick={onClick}>Home</a>
                <span> | </span>
                <a href="/page1" onClick={onClick}>Page1</a>
                <span> | </span>
                <a href="/page2" onClick={onClick}>Page2</a>
                <span> | </span>
                <a href="/page3" onClick={onClick}>Page3</a>
            </p>
        );
    }
}

@connect(state => state)
class App extends React.Component {
    navigate = (e) => {
        e.preventDefault();
        var { dispatch } = this.props;
        var uri = e.target.href.split('/').pop();
        dispatch(changePage(uri));
    }
    render() {
        var { pages, params } = this.props;
        return (
            <div className="container">
                <Menu onClick={this.navigate} />
                <hr />
                <ActivePage 
                    pages={pages}
                    activePage={params.pageId} />
                <hr />
                <h5>Routed Content <small>{this.props.children}</small></h5>
            </div>
        );
    }
}

const localState = {
    pages: [{
        id: 'home',
        title: 'home page'
    }, {
        id: 'page1',
        title: 'Page One'
    }, {
        id: 'page2',
        title: 'Page Two'
    }]
};

function makeRoutes(initialState) {
    const store = createStore(appReducer, localState);
    
    const routes = (
        <Route component={reduxRouteComponent(store)}>
            <Route path="/" component={App}>
                <Route path="/:pageId" component={RouteInfo} />
            </Route>
        </Route>
    );

    return [routes, store];
}

export function start(initialState) {
    var BrowserHistory = require('react-router/lib/BrowserHistory').history;
    var [routes] = makeRoutes(initialState);

    React.render((
        <Router history={BrowserHistory}>
            {routes}
        </Router>
    ), document.getElementById('app'));
}

export function renderMarkup(initialState) {
    var Location = require('react-router/lib/Location');
    var [routes] = makeRoutes(initialState);
    var html;
    
    Router.run(routes, new Location('/'), (err, initialState) => {
        html = React.renderToString(<Router {...initialState}/>);
    });

    return html; 
}
