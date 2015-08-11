Fluxo
---

`Fluxo` is an opinionated implementation of `ReactJS`' _Flux_.

It is inspired by `Reflux` in the way that every single event is a _subscribable_ object but then there is no asynchronous execution support build-in.

> Asynchronous actions can be easily implemented by **many actions**
> fired at the proper time.


## Setup

    // in your console
    npm install --save fluxo
    
    // in your module
    var Fluxo = require('fluxo');


## Quick Usage

> **IMPORTANT:**  
> there is more than this chapter!  
> Don't stop here!

A store instance holds a piece of the _application's state_ which happens to be just a simple Javascript object.

> Within the store you define the piece logic that 
> **change the state in response to an action**.

Therefore a store definition is composed by:

- the state, with optionals initial values
- a list of actions that affect the state
- a list of methods that apply the change in the state

There you go with a simple example:

    var myStore = Fluxo.createStore({
      
      getInitialState: function() {
        return {
          name: 'Luke',
          surname: 'Skywalker'
        };
      },
      
      actions: [
        'set-name', 
        'set-surname'
      ],
      
      onSetName(value) {
        this.setState({
          name: value
        });
      },
      
      onSetSurname(value) {
        this.setState({
          surname: value
        });
      }
    });
    
This definition gives you a ready to use store which you can tie up with a _ControllerView_:
	
	// subscribe the component's state to inherith the store's
    componendWillMount() {
      this._sub = myStore.subscribe(newState => this.setState(newState));
    }
    
    // release the subscription when the View component goes away
    componentWillUnmount() {
      this._sub.dispose();
    }

Or you can use the **handy mixin** that every store provides:

    React.createClass({
      mixins: [myStore.componentMixin()]
    });
    
Then you can start to **change the state by firing actions**:
	
	React.createClass({
      ...
      onClick() {
        myStore.trigger('set-name', 'Darth');
        myStore.trigger('set-surname', 'Vader');
      },
      render() {
        return <button onClick={this.onClick}>turn to the dark side</button>;
      }
    });
    
## Actions

Every action in `Fluxo` is an _observable_ object to which a store can subscribe.

    var setName = Fluxo.createAction('set-name'),
    
With a reference to a valid action you can fire it with the values you want:

    setName('Darth', 'Vader', 'is', 'Evil');
    
All those values will be forwarded to every subscriber:

    setName.subscribe(function(name, surname, ...) {
      console.log(name, surname);
    });
    
However only the first argument will be stored as "current value" for the action. 
In this way any action can be used as getter/setter:

	setName('foo');
	console.log(setName()); // -> "foo"
	
Obviously you can set an initial value when you first define the action:

    var setName = Fluxo.createAction('set-name', 'Luke'),

There is also a config object based syntax to define an action:

    Fluxo.createAction({
      signature: 'set-name',
      initialValue: 'Luke'
    });

### Actions Register

Every action is stored in a global register, if you try to define the same action twice you'll get a beautiful error.

> An action express a state permutation in the application therefore is unique.

Another implication is that you can retrive a reference to an existing action from any point in you app:

    var setName = Fluxo.getAction('set-name');
    
You can also use the global scope to fire an action:

    Fluxo.trigger('set-name', 'Darth');
    
Actually `Fluxo` itself behaves as dispatcher in the _Flux_ echosystem.


## Computed Actions

I borrowed this concept from _KnockoutJS_ with which I played for a long long time.

> A `ComputedAction` combines values from other actions (or computed actions) to build new values.

A `ComputedAction` is automatically fired when one of the controlled actions fire.  
It's automatic and quite optimised for performances just out of the box.

    var fullName = Fluxo.createComputedAction({
      signature: 'full-name',
      fn: function() {
        return setName() + ' ' + setSurname();
      }
    });

Then you can subscribe to a `ComputerAction` the same way you do with a normal one:

    fullName.subscribe(val => console.log(val));
    
### Why Computed Actions?

To reduce computation when your app grows very big.

Imagine to have two properties `name` and `surname` and you want to show the `full name` in many different views.

Each of those views will mixin a store and their `render()` method will look like:

    render() {
      var fullName = this.state.name + ' ' + this.state.surname;
      return <div>{fullName}</div>;
    }

As the application grows bigger we will repeat this silly concatenation **over and over again**. I don't like it.

Computed actions are designed to distill a result like a `fullName` so to **serve a cached value to every store that may require it**.

Of course this is a weapon to use with caution. It may be easy to loose track of the relationships between various actions/computer-actions.

> with great power comes great responsability


