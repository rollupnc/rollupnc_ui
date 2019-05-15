const defaultSettings = {
    ethereumEndpoint: 'https://ropsten.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5',
    rollupNCName: 'rollupNC-POC',
    contractAddress: '0x83Ca025AeF5747f5c418f1Bd1124F21a53254e61'
  }
  
  const loadSettings = () => {
    let settings
    try {
      settings = JSON.parse(localStorage.getItem('settings'))
    } finally {
      settings = settings || defaultSettings
    }
    return settings
  }
  
  const saveSettings = (settings) => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
  
  export default {
    loadSettings,
    saveSettings,
    defaultSettings
  }
  