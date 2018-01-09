# Actions

## What are actions?
Essentially, [Siren actions](https://github.com/kevinswiber/siren#actions-1) _describe_ how to form a Siren API request.

## Getting started
The simplest way to get started is to call the `actionCreators` factory function, which will create a new API for performing actions:

```javascript
import sirenState from 'siren-state';

const api = sirenState();
const actionCreatorApi = api.actionCreators(); // Pass this API object around the application wherever actions are needed
```

## `SirenForm`
For dealing with actions, `siren-state` exposes a class called `SirenForm`.

You can think of a `SirenForm` as an "instance" of an action. The `SirenForm` understands how to mutate the fields (maybe from a user typing), and then eventually how it should be serialized for API transport.

> 💡 Throughout the course of an application, you may create many instances of a single action. Actions should be immutable, while `SirenForm` instances are mutable.

For example, let's imagine a Siren action which creates a `pet` entity (specifically a cat):
```javascript
const createPetAction = {
    "name": "create-cat",
    "href": "/api/pets",
    "fields": [
        { "name": "nickname", "name": "text" },
        { "name": "animalType", "name": "text", "value": "CAT" }
    ],
    "method": "POST"
};
```

Using the `SirenForm` class, we can create a new form and update it:
```javascript
const createPetForm = new SirenForm(createPetAction);
createPetForm.updateFields({ name: 'Yan' });
```

Finally, when we want to "submit" this form:
```javascript
actionCreatorsApi.doAction(createPetForm);
```

The `actionCreatorsApi` will understand how to generate the proper HTTP request:

```http
POST /api/pets HTTP/2
Content-Type: application/json
Accepts: application/vnd.siren+json

{
    "name": "Yan",
    "animalType": "CAT"
}
```

And that's it! 🎉

Well, except you still probably want to access the entity returned by performing the action:
```javascript

const selfLink = sirenStateApi.state.bookkeepping.getEntry(createPetForm.id); // /api/pets/1 or whatever the server created
const pet = sirenStateApi.state.store.getEntityByHref(selfLink); // The new Pet object!
```

> 💡 Accessing state is described more in-depth in the [state documentation](State.md).
