import AppRouter from '@/routes/AppRoutes'
import Header from '@/components/Header'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-grow flex justify-center">
        <AppRouter />
      </div>
    </div>
  )
}

export default App
