import { useState, useEffect, useRef } from 'react'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'success' | 'warning'
  content: string
  timestamp: Date
}

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Focus input on mount and keep it focused
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Initialize with welcome message and run help command
  useEffect(() => {
    const welcomeLines: TerminalLine[] = [
      {
        id: 'welcome-1',
        type: 'success',
        content: '██╗   ██╗███████╗██████╗ ██████╗ ███████╗',
        timestamp: new Date()
      },
      {
        id: 'welcome-2',
        type: 'success',
        content: '██║   ██║██╔════╝██╔══██╗██╔══██╗██╔════╝',
        timestamp: new Date()
      },
      {
        id: 'welcome-3',
        type: 'success',
        content: '██║   ██║█████╗  ██████╔╝██████╔╝███████╗',
        timestamp: new Date()
      },
      {
        id: 'welcome-4',
        type: 'success',
        content: '╚██╗ ██╔╝██╔══╝  ██╔══██╗██╔══██╗╚════██║',
        timestamp: new Date()
      },
      {
        id: 'welcome-5',
        type: 'success',
        content: ' ╚████╔╝ ███████╗██║  ██║██████╔╝███████║',
        timestamp: new Date()
      },
      {
        id: 'welcome-6',
        type: 'success',
        content: '  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝',
        timestamp: new Date()
      },
      {
        id: 'welcome-7',
        type: 'output',
        content: '',
        timestamp: new Date()
      },
      {
        id: 'welcome-8',
        type: 'output',
        content: '           Web3 Abstractions & Adapters',
        timestamp: new Date()
      },
      {
        id: 'welcome-9',
        type: 'output',
        content: '',
        timestamp: new Date()
      },
      {
        id: 'welcome-10',
        type: 'output',
        content: 'Welcome to Verbs Terminal!',
        timestamp: new Date()
      },
      {
        id: 'welcome-11',
        type: 'output',
        content: '',
        timestamp: new Date()
      },
      {
        id: 'help-cmd',
        type: 'input',
        content: 'verbs@terminal:~$ help',
        timestamp: new Date()
      },
      {
        id: 'help-output',
        type: 'output',
        content: `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  wallet create - Create a new wallet
  wallet list   - List all wallets
  status        - Show system status
  exit          - Exit terminal (just kidding!)`,
        timestamp: new Date()
      },
      {
        id: 'help-end',
        type: 'output',
        content: '',
        timestamp: new Date()
      }
    ]
    setLines(welcomeLines)
  }, [])

  const processCommand = (command: string) => {
    const trimmed = command.trim()
    if (!trimmed) return

    // Add command to history
    setCommandHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)

    // Add the command line to display
    const commandLine: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: 'input',
      content: `verbs@terminal:~$ ${trimmed}`,
      timestamp: new Date()
    }

    let response: TerminalLine
    const responseId = `resp-${Date.now()}`

    switch (trimmed.toLowerCase()) {
      case 'help':
        response = {
          id: responseId,
          type: 'output',
          content: `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  wallet create - Create a new wallet
  wallet list   - List all wallets
  status        - Show system status
  exit          - Exit terminal (just kidding!)`,
          timestamp: new Date()
        }
        break
      case 'clear':
        setLines([])
        return
      case 'wallet create':
        response = {
          id: responseId,
          type: 'success',
          content: 'Creating wallet... (not implemented yet)',
          timestamp: new Date()
        }
        break
      case 'wallet list':
        response = {
          id: responseId,
          type: 'output',
          content: 'No wallets found. Use "wallet create" to create one.',
          timestamp: new Date()
        }
        break
      case 'status':
        response = {
          id: responseId,
          type: 'success',
          content: `System Status: ONLINE
SDK Version: v0.0.1
Connected Networks: None
Active Wallets: 0`,
          timestamp: new Date()
        }
        break
      case 'exit':
        response = {
          id: responseId,
          type: 'warning',
          content: 'Nice try! But you cannot escape the terminal... 😈',
          timestamp: new Date()
        }
        break
      default:
        response = {
          id: responseId,
          type: 'error',
          content: `Command not found: ${trimmed}. Type "help" for available commands.`,
          timestamp: new Date()
        }
    }

    setLines(prev => [...prev, commandLine, response])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(currentInput)
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput('')
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div 
      className="w-full h-full flex flex-col bg-terminal-bg shadow-terminal-inner cursor-text"
      onClick={handleClick}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-4 border-b border-terminal-border bg-terminal-secondary">
        <div className="text-terminal-muted text-sm">verbs-terminal</div>
        <div className="text-terminal-dim text-xs">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent"
      >
        {lines.map((line) => (
          <div key={line.id} className="terminal-line">
            <div className={`terminal-output ${
              line.type === 'error' ? 'terminal-error' :
              line.type === 'success' ? 'terminal-success' :
              line.type === 'warning' ? 'terminal-warning' :
              line.type === 'input' ? 'text-terminal-muted' :
              'terminal-output'
            }`}>
              {line.content}
            </div>
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="terminal-line">
          <span className="terminal-prompt">verbs@terminal:~$</span>
          <div className="flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-terminal-text caret-transparent flex-shrink-0"
              style={{ width: `${Math.max(1, currentInput.length)}ch` }}
              autoComplete="off"
              spellCheck="false"
            />
            <span className="terminal-cursor ml-0"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terminal