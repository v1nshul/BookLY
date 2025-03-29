
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors 
        'light-bg': '#F5F1E9',    
        'light-text': '#5C4033',   
        'light-card': '#FDFBF7',   
        'light-border': '#D9C2A7',  

        // Dark mode colors 
        'dark-bg': '#2F1F17',       
        'dark-text': '#D9BFA6',     
        'dark-card': '#3D2A20',     
        'dark-border': '#5C4033',   
      },
    },
  },
  plugins: [],
};