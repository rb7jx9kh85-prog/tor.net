import './globals.css'

export const metadata = { title: 'tor.net — ChatGPT à l’école', description: 'Un espace de travail simple pour utiliser les modèles OpenAI.' }

export default function RootLayout({ children }) {
  return <html lang="fr"><body>{children}</body></html>
}
