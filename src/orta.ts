import * as vscode from "vscode"
import * as fs from "fs"

// import createChannel from "@storybook/channel-websocket"
// import * as WebSocket from "ws"
// const g = global as any
// g.WebSocket = WebSocket
// import * as glob from "glob"

//create your own websocket? he used the ws library because it is abstracting

//removed "Story" here (known as "UserComponent" in ours) -- never called here
import { TreeViewProvider, StoryObject } from "./treeviewProvider"
import { StoryPickerProvider, StorySelection } from "./picker-provider"

// var storybooksChannel: any
// var connectedOnce = false

export function activate(context: vscode.ExtensionContext) {

  //set context to "aesop-awake"; this context enables all other commands
  //TO-DO: figure out if this is a VSCode native command, what is the Boolean
  vscode.commands.executeCommand("setContext", "aesop-awake", true)

  //this is something only needed when you use the storybook-channels websocket library?
  // let previewUri = vscode.Uri.parse("storybook://authority/preview")

  class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    public provideTextDocumentContent(uri: vscode.Uri): string {

      //PORT and HOST are configured manually in the package.json --> are these configurable?
      const port = vscode.workspace.getConfiguration("react-native-storybooks").get("port")
      const host = vscode.workspace.getConfiguration("react-native-storybooks").get("host")

      //this return value is what would normally get popped into the preview --> (ifstyle?)

      return `
            <style>iframe {
                position: fixed;
                border: none;
                top: 0; right: 0;
                bottom: 0; left: 0;
                width: 100%;
                height: 100%;
            }
            </style>

            <body onload="iframe.document.head.appendChild(ifstyle)" style="background-color:red;margin:0px;padding:0px;overflow:hidden">
                <iframe src="http://${host}:${port}" frameborder="0"></iframe>
            </body>
            `
    }
  }

  let provider = new TextDocumentContentProvider()
  let registration = vscode.workspace.registerTextDocumentContentProvider("storybook", provider)

  //CHANGE TO: STORYBOOK (Aesop)
  //"storybook" is the scheme here; where is that defined? contributes?
  const storiesProvider = new TreeViewProvider()
  vscode.window.registerTreeDataProvider("storybook", storiesProvider)

  const pickerProvider = new StoryPickerProvider(storiesProvider)

  // Registers the storyboards command to trigger a new HTML preview which hosts the storybook server
  let disposable = vscode.commands.registerCommand("extension.showStorybookPreview", () => {
    //TURNS OUT vscode.previewHtml is DEPRECATED in favor of webviews as of March 2019
    //maybe we can use a blank webview and REASSIGN its html each time with a boilerplate HTML file and an iframe spot for the html fired at previewHtml here

    return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Storybooks").then(
      success => {},
      //should really (by convention) use a .catch() method for the error (call it "error", not "reason")
      reason => {
        vscode.window.showErrorMessage(reason)
      }
    )
  })

  context.subscriptions.push(disposable, registration)

  /*
  //grabs the configuration again inside the registered command?
  const host = vscode.workspace.getConfiguration("react-native-storybooks").get("host")
  const port = vscode.workspace.getConfiguration("react-native-storybooks").get("port")

  storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })

  //declares variables with no initial value, reassigns at each request
  var currentKind: string = null
  var currentStory: string = null
  var currentStoryId: string = null

  // Create a statusbar item to reconnect, when we lose connection
  const reconnectStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
  reconnectStatusBarItem.command = "extension.restartConnectionToStorybooks"
  if (connectedOnce) {
    reconnectStatusBarItem.text = "Reconnect Storybooks"
    reconnectStatusBarItem.color = "#FF8989"
  } else {
    reconnectStatusBarItem.text = "Connect to Storybooks"
  }

  reconnectStatusBarItem.hide()

  // when we (re-)connect to Storybook's server, pass the WS connection to this func, so callbacks can occur on new socket connection

  const registerCallbacks = channel => {

    // Called when we first get stories from the Storybook server
    // may have to add logic that executes a getStories command after the webview has been served up by the primary Aesop Awaken function
    //setStories is a method defined on the websocket connection

    channel.on("setStories", data => {
      //this configuration exists in package.json, and defines a filter that is initialised to a "."
      //this is probably configurable in the extension settings, something we still have to tackle
      //we should also think about the store presentation, logo, Readme...

      //TO FOLLOW UP: why use this filter? what is it reading? the DOM on the server?

      const filter = vscode.workspace.getConfiguration("react-native-storybooks").get("storybookFilterRegex") as string
      const regex = new RegExp(filter)

      //use Story interface to init this variable (id: string, name: string)
      let stories: Story[] = []

      //gets the data returned from the socket when calling setStories, we see if the data has a property "stories" which contains an Array of usable elements

      if (Array.isArray(data.stories)) {
        //if the data contains a stories property that is an Array
        //declare a variable kinds that:
        //inits to an empty Object but takes a type assertion of:
        //Object -> [key]: value = array of Story Objects
        
        let kinds: { [key: string]: StoryObject[] } = {}
        //this is basically asking if the stories returned from the data have a "kind" property, and if the kind contains a period

        const storydata = data.stories.filter(s => s.kind.match(regex))

        storydata.map(story => {
          story.stories.map(singleStory => {
            if (kinds[story.kind] == undefined) {
              // kinds[story.kind] = [story.name]
              kinds[story.kind] = [{ name: singleStory, id: singleStory }]
            } else {
              kinds[story.kind].push({ name: singleStory, id: singleStory })
            }
          })
        })
        Object.keys(kinds).forEach(function(key) {
          stories.push({
            kind: key,
            stories: kinds[key]
          })
        })
      } else {
        let kinds: { [key: string]: StoryObject[] } = {}
        Object.keys(data.stories).forEach(function(key) {
          const story = data.stories[key]
          if (story.kind.match(regex)) {
            if (kinds[story.kind] == undefined) {
              // kinds[story.kind] = [story.name]
              kinds[story.kind] = [{ name: story.name, id: story.id }]
            } else {
              kinds[story.kind].push({ name: story.name, id: story.id })
            }
          }
        })
        Object.keys(kinds).forEach(function(key) {
          stories.push({
            kind: key,
            stories: kinds[key]
          })
        })
      }
      storiesProvider.stories = stories
      storiesProvider.refresh()
      reconnectStatusBarItem.hide()
    })

    // When the server in RN starts up, it asks what should be default
    channel.on("getCurrentStory", () => {
      storybooksChannel.emit("setCurrentStory", {
        storyId: currentStoryId
      })
    })

    // The React Native server has closed
    channel.transport.socket.onclose = () => {
      storiesProvider.stories = []
      storiesProvider.refresh()
      reconnectStatusBarItem.show()
    }

    channel.emit("getStories")
  }

  registerCallbacks(storybooksChannel)

  vscode.commands.registerCommand("extension.searchStories", () => {
    vscode.window.showQuickPick(pickerProvider.toList()).then((picked: string) => {
      const setParams = pickerProvider.getParts(picked)
      setCurrentStory(setParams)
    })
  })
  */

  // Allow clicking, and keep state on what is selected
  vscode.commands.registerCommand("extension.openStory", (section, story) => {
    // Handle a Double click
    if (currentStoryId === story.id && currentKind === section.kind && currentStory === story.name) {
      findFileForStory(section.kind, story.name).then(results => {
        if (results) {
          vscode.workspace.openTextDocument(results.uri).then(doc => {
            vscode.window.showTextDocument(doc).then(shownDoc => {
              let range = doc.lineAt(results.line - 1).range
              vscode.window.activeTextEditor.selection = new vscode.Selection(range.start, range.end)
              vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenter)
            })
          })
        }
      })
      return
    }

    setCurrentStory({ storyId: story.id, kind: section.kind, story: story.name })
  })

  function setCurrentStory(params: StorySelection) {
    const currentChannel = () => storybooksChannel
    currentKind = params.kind
    currentStory = params.story
    currentStoryId = params.storyId
    currentChannel().emit("setCurrentStory", params)
  }

  /*
  //when connecting to storybook, create a websocket connection
  //then pass it as an argument to the registerCallbacks function
  vscode.commands.registerCommand("extension.connectToStorybooks", () => {
    storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
    registerCallbacks(storybooksChannel)
  })

  vscode.commands.registerCommand("extension.restartConnectionToStorybooks", () => {
    storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
    registerCallbacks(storybooksChannel)
  })

  vscode.commands.registerCommand("extension.goToNextStorybook", () => {
    const stories = storiesProvider.stories
    const currentSection = stories.find(s => s.kind === currentKind)
    const currentStories = currentSection.stories
    const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
    if (currentIndex === currentStories.length) {
      // if you have reached the last story of an array of stories, enables the ability to wrap around
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[0])
    } else {

      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex + 1])
    }
  })

  vscode.commands.registerCommand("extension.goToPreviousStorybook", () => {
    const stories = storiesProvider.stories
    const currentSection = stories.find(s => s.kind === currentKind)
    const currentStories = currentSection.stories
    const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
    if (currentIndex === 0) {
      // go around or something
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentStories.length - 1])
    } else {
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex - 1])
    }
  })
  
  */

  vscode.commands.registerCommand("extension.expandAllStories", () => {
    storiesProvider.expandAll()
  })

  vscode.commands.registerCommand("extension.collapseAllStories", () => {
    storiesProvider.collapseAll()
  })
}

// Loop through all globbed stories,
// reading the files for the kind and the story name

const findFileForStory = async (kind: string, story: string): Promise<{ uri: vscode.Uri; line: number } | null> => {
  return new Promise<{ uri: vscode.Uri; line: number }>((resolve, reject) => {
    //this regex is set as a glob expression in package.json that finds **.story.* files
    const regex = vscode.workspace.getConfiguration("react-native-storybooks").get("storyRegex") as string

    const root = vscode.workspace.workspaceFolders
    vscode.workspace.findFiles(regex, "**/node_modules").then(files => {
      let found = false
      for (const file of files) {
        const content = fs.readFileSync(file.fsPath, "utf8")
        if (content.includes(kind) && content.includes(story)) {
          const line = content.split(story)[0].split("\n").length
          resolve({ uri: file, line })
          found = true
        }
      }
      if (!found) {
        resolve(null)
      }
    })
  })
}

export function deactivate() {
  storybooksChannel.transport.socket.close()
}
