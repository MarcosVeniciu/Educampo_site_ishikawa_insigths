import type { Config } from 'tailwindcss'

const config: Config = {
  // O "content" diz ao Tailwind onde procurar as classes (como bg-blue-600)
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Aqui podemos configurar tons específicos do Educampo se necessário no futuro
      colors: {
        educampo: {
          blue: '#2563eb', // Exemplo de azul primário
        }
      }
    },
  },
  plugins: [],
}
export default config