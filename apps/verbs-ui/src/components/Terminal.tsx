import { useState, useEffect, useRef } from 'react'
import type {
  CreateWalletResponse,
  GetAllWalletsResponse,
} from '@eth-optimism/verbs-sdk'
import VerbsLogo from './VerbsLogo'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'success' | 'warning'
  content: string
  timestamp: Date
}

interface PendingPrompt {
  type: 'userId'
  message: string
}

const HELP_CONTENT = `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  wallet create - Create a new wallet
  wallet list   - List all wallets
  status        - Show system status
  exit          - Exit terminal

Verbs (coming soon):
  fund          - Onramp to stables
  lend          - Open Morpho loan
  borrow        - Borrow via Morpho
  repay         - Repay Morpho loan
  swap          - Trade via Uniswap
  earn          - Earn DeFi yield`

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [pendingPrompt, setPendingPrompt] = useState<PendingPrompt | null>(null)
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
        id: 'welcome-ascii',
        type: 'success',
        content: `
██╗   ██╗ ███████╗ ██████╗  ██████╗  ███████╗
██║   ██║ ██╔════╝ ██╔══██╗ ██╔══██╗ ██╔════╝
██║   ██║ █████╗   ██████╔╝ ██████╔╝ ███████╗
╚██╗ ██╔╝ ██╔══╝   ██╔══██╗ ██╔══██╗ ╚════██║
 ╚████╔╝  ███████╗ ██║  ██║ ██████╔╝ ███████║
  ╚═══╝   ╚══════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══════╝`,
        timestamp: new Date(),
      },
      {
        id: 'welcome-7',
        type: 'output',
        content: '',
        timestamp: new Date(),
      },
      {
        id: 'welcome-8',
        type: 'output',
        content: '   Money Verbs library for the OP Stack',
        timestamp: new Date(),
      },
      {
        id: 'welcome-9',
        type: 'output',
        content: '',
        timestamp: new Date(),
      },
      {
        id: 'help-cmd',
        type: 'input',
        content: 'verbs: $ help',
        timestamp: new Date(),
      },
      {
        id: 'help-output',
        type: 'output',
        content: HELP_CONTENT,
        timestamp: new Date(),
      },
      {
        id: 'help-end',
        type: 'output',
        content: '',
        timestamp: new Date(),
      },
    ]
    setLines(welcomeLines)
  }, [])

  const createWallet = async (
    userId: string,
  ): Promise<CreateWalletResponse> => {
    const response = await fetch(`http://localhost:3000/wallet/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create wallet')
    }

    const data = await response.json()
    return data
  }

  const getAllWallets = async (): Promise<GetAllWalletsResponse> => {
    const response = await fetch('http://localhost:3000/wallets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch wallets')
    }

    const data = await response.json()
    return data
  }

  const processCommand = (command: string) => {
    const trimmed = command.trim()
    if (!trimmed) return

    // Handle pending prompts
    if (pendingPrompt) {
      if (pendingPrompt.type === 'userId') {
        handleWalletCreation(trimmed)
        return
      }
    }

    // Add command to history
    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    // Add the command line to display
    const commandLine: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: 'input',
      content: `verbs: $ ${trimmed}`,
      timestamp: new Date(),
    }

    let response: TerminalLine
    const responseId = `resp-${Date.now()}`

    switch (trimmed.toLowerCase()) {
      case 'help':
        response = {
          id: responseId,
          type: 'output',
          content: HELP_CONTENT,
          timestamp: new Date(),
        }
        break
      case 'clear':
        setLines([])
        return
      case 'wallet create':
        setPendingPrompt({
          type: 'userId',
          message: 'Enter unique userId:',
        })
        setLines((prev) => [...prev, commandLine])
        return
      case 'wallet list':
        setLines((prev) => [...prev, commandLine])
        handleWalletList()
        return
      case 'status':
        response = {
          id: responseId,
          type: 'success',
          content: `System Status: ONLINE
SDK Version: v0.0.2
Connected Networks: None
Active Wallets: 0`,
          timestamp: new Date(),
        }
        break
      case 'exit':
        response = {
          id: responseId,
          type: 'warning',
          content: 'Nice try! But the ride never ends...',
          timestamp: new Date(),
        }
        break
      case 'fund':
      case 'lend':
      case 'borrow':
      case 'repay':
      case 'swap':
        response = {
          id: responseId,
          type: 'error',
          content: 'Soon.™',
          timestamp: new Date(),
        }
        break
      default:
        response = {
          id: responseId,
          type: 'error',
          content: `Command not found: ${trimmed}. Type "help" for available commands.`,
          timestamp: new Date(),
        }
    }

    setLines((prev) => [...prev, commandLine, response])
  }

  const handleWalletCreation = async (userId: string) => {
    const userInputLine: TerminalLine = {
      id: `input-${Date.now()}`,
      type: 'input',
      content: `Enter userId for the new wallet: ${userId}`,
      timestamp: new Date(),
    }

    const loadingLine: TerminalLine = {
      id: `loading-${Date.now()}`,
      type: 'output',
      content: 'Creating wallet...',
      timestamp: new Date(),
    }

    setLines((prev) => [...prev, userInputLine, loadingLine])
    setPendingPrompt(null)

    try {
      const result = await createWallet(userId)

      const successLine: TerminalLine = {
        id: `success-${Date.now()}`,
        type: 'success',
        content: `Wallet created successfully!
Address: ${result.address}
User ID: ${result.userId}`,
        timestamp: new Date(),
      }

      setLines((prev) => [...prev.slice(0, -1), successLine])
    } catch (error) {
      const errorLine: TerminalLine = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: `Failed to create wallet: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        timestamp: new Date(),
      }

      setLines((prev) => [...prev.slice(0, -1), errorLine])
    }
  }

  const handleWalletList = async () => {
    const loadingLine: TerminalLine = {
      id: `loading-${Date.now()}`,
      type: 'output',
      content: 'Fetching wallets...',
      timestamp: new Date(),
    }

    setLines((prev) => [...prev, loadingLine])

    try {
      const result = await getAllWallets()

      if (result.wallets.length === 0) {
        const emptyLine: TerminalLine = {
          id: `empty-${Date.now()}`,
          type: 'output',
          content: 'No wallets found. Create one with "wallet create".',
          timestamp: new Date(),
        }
        setLines((prev) => [...prev.slice(0, -1), emptyLine])
        return
      }

      const walletList = result.wallets
        .map((wallet, index) => `${index + 1}. ${wallet.address}`)
        .join('\n')

      const successLine: TerminalLine = {
        id: `success-${Date.now()}`,
        type: 'success',
        content: `Found ${result.count} wallet(s):

${walletList}`,
        timestamp: new Date(),
      }

      setLines((prev) => [...prev.slice(0, -1), successLine])
    } catch (error) {
      const errorLine: TerminalLine = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: `Failed to fetch wallets: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        timestamp: new Date(),
      }

      setLines((prev) => [...prev.slice(0, -1), errorLine])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(currentInput)
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1)
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
    // Don't refocus if user is selecting text
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return
    }

    // Don't refocus if click is on selected text
    if (selection && !selection.isCollapsed) {
      return
    }

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
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
          <VerbsLogo />
          <div className="text-terminal-muted text-sm hover:text-terminal-accent transition-colors">
            verbs-terminal
          </div>
        </div>
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
          <div
            key={line.id}
            className={line.id === 'welcome-ascii' ? '' : 'terminal-line'}
          >
            <div
              className={
                line.id === 'welcome-ascii'
                  ? ''
                  : `terminal-output ${
                      line.type === 'error'
                        ? 'terminal-error'
                        : line.type === 'success'
                        ? 'terminal-success'
                        : line.type === 'warning'
                        ? 'terminal-warning'
                        : line.type === 'input'
                        ? 'text-terminal-muted'
                        : 'terminal-output'
                    }`
              }
              style={
                line.id === 'welcome-ascii'
                  ? {
                      fontFamily:
                        'JetBrains Mono, Monaco, Menlo, Consolas, monospace',
                      color: '#b8bb26',
                      whiteSpace: 'pre',
                      lineHeight: '1.2',
                      margin: 0,
                      padding: 0,
                      border: 'none',
                    }
                  : {}
              }
            >
              {line.content}
            </div>
          </div>
        ))}

        {/* Current Input Line */}
        <div className="terminal-line">
          <span className="terminal-prompt">
            {pendingPrompt ? pendingPrompt.message : 'verbs: $'}
          </span>
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
