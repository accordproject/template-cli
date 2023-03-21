# Accord Project Template Manager

Command Line Interface for the [Accord Project Template Engine](https://github.com/accordproject/template-engine).


## Install

```shell
npm i @accordproject/template-cli -g
```

## Example Commands

### Help

```shell
ten help
```

### Generate

The `generate` command creates a document from a template + data.

The command below generates an HTML file using the `helloworld` template:

```shell
ten generate ~/dev/template-engine/test/templates/full/  ~/dev/template-engine/test/templates/full/data.json html ~/Desktop/test.html
```

### Compile

The `compile` command compiles a template to TypeScript code

The command below compiles the `helloworld` template:

```shell
ten compile ~/dev/template-engine/test/templates/helloworld ~/dev/temp/helloworld
```

To run the generated code:

```
cd ~/dev/temp/helloworld
npm i
npm start ~/dev/template-engine/test/templates/helloworld/data.json
```

The output should be:

```json
{
  "$class": "org.accordproject.commonmark@0.5.0.Document",
  "xmlns": "org.accordproject.commonmark@0.5.0",
  "nodes": [
    {
      "$class": "org.accordproject.ciceromark@0.6.0.Contract",
      "name": "top",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark@0.5.0.Paragraph",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark@0.5.0.Text",
              "text": "Hello ",
              "nodes": []
            },
            {
              "$class": "org.accordproject.ciceromark@0.6.0.Variable",
              "name": "message",
              "value": "\"World\""
            },
            {
              "$class": "org.accordproject.commonmark@0.5.0.Text",
              "text": ".",
              "nodes": []
            }
          ]
        }
      ]
    }
  ]
}
```