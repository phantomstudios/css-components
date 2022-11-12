# How to contribute

I'm really happy that you're interested in helping out with this little project.

As this is very early days for the project there's not a lot in the way of
resources, but please check out the [documentation](./README.md), and also the
[list of issues](https://github.com/phantomstudios/PACKAGE-NAME/issues).

Please submit an issue if you need help with anything.

We have a [code of conduct](./CODE_OF_CONDUCT.md) so please make sure you follow
it.

## Testing

Testing is performed using `jest` and is tested on Windows, Linux and MacOS with
Node 10 and 12 runtimes. For a PR to be considered all these environments need to
pass. Testing is automated using GitHub Actions CI.

## Submitting changes

Please send a
[GitHub Pull Request to PACKAGE-NAME](https://github.com/phantomstudios/PACKAGE-NAME/pull/new/master)
with a clear list of what you've done (read more about
[pull requests](https://help.github.com/en/articles/about-pull-requests)). When you send a pull
request, please make sure you've covered off all the points in the template.

Make sure you've read about our workflow (below); in essence make sure each Pull
Request is atomic but don't worry too much about the commits themselves as we use
squash-and-merge.

## Our workflow

We use [GitHub flow](https://guides.github.com/introduction/flow/); it's a lot
like git-flow but simpler and more forgiving. We use the `squash and merge`
strategy to merge Pull Requests.

In effect this means:

- Don't worry about individual commits. They will be preserved, but not on the
  main `master` branch history, so feel free to commit early and often, using
  git as a save mechanism.
- Your Pull Request title and description become very important; they are the
  history of the master branch and explain all the changes.
- You ought to be able to find any previous version easily using GitHub tabs, or
  [Releases](https://github.com/phantomstudios/PACKAGE-NAME/releases)

Thanks, John Chipps-Harding
