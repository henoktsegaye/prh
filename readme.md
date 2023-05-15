# Pull React Hook

Pull React Hook is a tool to install react hooks from a remote repository.
This tool let you pull react hooks from [custom-react-hooks](https://github.com/henoktsegaye/custom-react-hooks) repository.

## Installation

```bash
npm install -g pull-react-hooks
```

To use `prh` use alias

```bash
# if you are using bash
nano ~/.bashrc
# if you are using zsh
nano ~/.zshrc
# add this line to the end of the file
alias prh="npx pull-react-hooks"

####################

# then restart your terminal
source ~/.zshrc
# or
source ~/.bashrc
```

If you want to use `prh` instead of `pull-react-hooks` with `npx` , use alias on **npm level** (npm and others supports this)

```bash
npm install -g prh:npm@pull-react-hooks
# then use it as this
npx prh list
```

## Usage

To install a hook.


**Important**: it will install the hook in the current directory

```bash
npx run pull-react-hooks list
# lists all hooks to be installed ( you can select one and install it )

```

To see all available commands

```bash
npx run pull-react-hooks --help
```

## license

MIT
