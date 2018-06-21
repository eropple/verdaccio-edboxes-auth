# verdaccio-edboxes-gitlab #
`verdaccio-edboxes-gitlab` is the [Verdaccio] authentication plugin that powers
the auth scheme for Edboxes's NPM registry, where purchasing clients can access
[TaskBotJS] Pro and Enterprise. Users log in by passing, as their NPM password,
a GitLab Personal Access Token, which then wires up to GitLab and generates from
a user's profile a set of groups.

Assume, for yucks, that user `testbob` belongs to the group `groupA` and owns
group `groupB`. This plugin generates group names that begin with `member:` for
any group that the user is a member of and `owner:` of any group the user owns.
The user's own name is also a group. So our `testbob` user would hae a group
list that looks like this:

```js
[
  "testbob",
  "member:groupA",
  "member:groupB",
  "owner:groupB"
]
```

Nothing crazy. Also nothing configurable, aside from the server. But simple. ;)

## Configuration ##
```yaml
auth:
  edboxes-gitlab:
    gitlabServer: https://projects.edboxes.com
```

[Verdaccio]: http://verdaccio.org

[TaskBotJS]: https://github.com/eropple/taskbotjs
