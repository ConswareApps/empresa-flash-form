import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
			},
			fontSize: {
				'xs': '12px',
				'sm': '13px',
				'base': '13px',
				'lg': '14px',
				'xl': '16px',
				'2xl': '18px',
				'3xl': '20px',
				'4xl': '25px',
				'5xl': '28px',
				'6xl': '36px',
				'h6': '13px',
				'h5': '14px', 
				'h4': '16px',
				'h3': '20px',
				'h2': '28px',
				'h1': '36px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Colores específicos de Consware
				consware: {
					green: 'hsl(var(--consware-green))',
					'green-secondary': 'hsl(var(--consware-green-secondary))',
					'green-button': 'hsl(var(--consware-green-button))',
					'green-active': 'hsl(var(--consware-green-active))',
					blue: 'hsl(var(--consware-blue))',
					dark: 'hsl(var(--consware-dark))',
					red: 'hsl(var(--consware-red))',
					'red-alt': 'hsl(var(--consware-red-alt))',
					'gray-primary': 'hsl(var(--consware-gray-primary))',
					'gray-secondary': 'hsl(var(--consware-gray-secondary))',
					'gray-light': 'hsl(var(--consware-gray-light))',
					'gray-dark': 'hsl(var(--consware-gray-dark))',
					'gray-medium': 'hsl(var(--consware-gray-medium))',
					'gray-quaternary': 'hsl(var(--consware-gray-quaternary))',
					'gray-border': 'hsl(var(--consware-gray-border))',
					'bg-green': 'hsl(var(--consware-bg-green))',
					'bg-gray': 'hsl(var(--consware-bg-gray))',
					'bg-content': 'hsl(var(--consware-bg-content))',
					success: 'hsl(var(--consware-success))',
					info: 'hsl(var(--consware-info))',
					warning: 'hsl(var(--consware-warning))',
					danger: 'hsl(var(--consware-danger))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
