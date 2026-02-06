import React, { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import DownloadIcon from "@mui/icons-material/Download"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AddIcon from "@mui/icons-material/Add"

interface ConfigEditorProps {
  initialConfig: any
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',
    },
    background: {
      paper: '#1F2937', // gray-800
      default: '#111827', // gray-900
    },
    text: {
      primary: '#F3F4F6', // gray-100
      secondary: '#9CA3AF', // gray-400
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#9CA3AF',
            '&.Mui-focused': {
              color: '#60a5fa',
            },
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: '#9CA3AF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#60a5fa',
            },
            '& input': {
              color: '#F3F4F6',
            },
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(31, 41, 55, 0.5)', // gray-800 with opacity
          backgroundImage: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '8px 0',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          color: '#F3F4F6',
          '& .MuiSvgIcon-root': {
            color: '#9CA3AF',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#9CA3AF',
          '&.Mui-selected': {
            color: '#60a5fa',
          },
        },
      },
    },
  },
})

const ConfigEditor: React.FC<ConfigEditorProps> = ({ initialConfig }) => {
  const [jsonText, setJsonText] = useState(
    JSON.stringify(initialConfig, null, 2),
  )
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [parsedConfig, setParsedConfig] = useState(initialConfig)
  
  // Resizable Split Pane State
  const [visualWidth, setVisualWidth] = useState(50) // percentage
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    try {
      const newConfig = JSON.parse(jsonText)
      setParsedConfig(newConfig)
      setJsonError(null)
    } catch (error) {
       // Keep previous valid config
    }
  }, [jsonText])

  const handleJsonTextChange = (value: string) => {
    setJsonText(value)
    
    try {
      JSON.parse(value)
      setJsonError(null)
    } catch (error) {
      setJsonError("JSON inválido: " + (error as Error).message)
    }
  }

  const updateJsonField = (path: string, value: string) => {
    try {
      const config = JSON.parse(jsonText)
      const keys = path.split('.')
      let current = config
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      
      current[keys[keys.length - 1]] = value
      const updatedJson = JSON.stringify(config, null, 2)
      setJsonText(updatedJson)
    } catch (error) {
      setJsonError("Error al actualizar: " + (error as Error).message)
    }
  }

  const updateJsonFieldNumeric = (path: string, value: string) => {
    try {
      const numValue = Number(value)
      const config = JSON.parse(jsonText)
      const keys = path.split('.')
      let current = config
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      
      current[keys[keys.length - 1]] = numValue
      const updatedJson = JSON.stringify(config, null, 2)
      setJsonText(updatedJson)
    } catch (error) {
      setJsonError("Error al actualizar: " + (error as Error).message)
    }
  }

  const updateJsonFieldNumericArray = (path: string, value: string) => {
    try {
      const arrayValue = value.split(",").map(v => Number(v.trim()))
      const config = JSON.parse(jsonText)
      const keys = path.split('.')
      let current = config
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      
      current[keys[keys.length - 1]] = arrayValue
      const updatedJson = JSON.stringify(config, null, 2)
      setJsonText(updatedJson)
    } catch (error) {
      setJsonError("Error al actualizar: " + (error as Error).message)
    }
  }

  const addArrayItem = (path: string, defaultItem: any) => {
    try {
      const config = JSON.parse(jsonText)
      const keys = path.split('.')
      let current = config
      
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (!current[key]) current[key] = [] // Ensure generic array/object exists
        current = current[key]
      }
      
      if (Array.isArray(current)) {
        current.push(defaultItem)
        const updatedJson = JSON.stringify(config, null, 2)
        setJsonText(updatedJson)
      } else {
        setJsonError(`Error: ${path} no es un array`)
      }
    } catch (error) {
      setJsonError("Error al añadir item: " + (error as Error).message)
    }
  }

  const downloadJSON = () => {
    const blob = new Blob([jsonText], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "travel.config.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Resizing Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      // Calculate percentage width based on mouse X position relative to window width
      // A more robust solution would be relative to the container, but window is fine for full width layout
      const newWidth = (e.clientX / window.innerWidth) * 100
      
      // Constrain width between 20% and 80% to avoid disappearing panes
      if (newWidth > 20 && newWidth < 80) {
        setVisualWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])


  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ color: "text.primary", p: 2, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', gap: 0 }}>
          {/* Visual Editor Pane */}
          <Box sx={{ 
            width: `${visualWidth}%`, 
            display: 'flex', 
            flexDirection: 'column',
            overflowY: 'auto',
            pr: 2
          }}>
            <Typography variant="h6" mb={2} color="text.secondary">
              Editor Visual
            </Typography>
            <Stack spacing={3} pb={4}>
              {/* Site Configuration */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Configuración del Sitio</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Logo"
                      value={parsedConfig?.site?.logo || ""}
                      onChange={(e) => updateJsonField("site.logo", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Título"
                      value={parsedConfig?.site?.title || ""}
                      onChange={(e) => updateJsonField("site.title", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Subtítulo"
                      value={parsedConfig?.site?.subtitle || ""}
                      onChange={(e) => updateJsonField("site.subtitle", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Nombre del Blog"
                      value={parsedConfig?.site?.blog?.name || ""}
                      onChange={(e) => updateJsonField("site.blog.name", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="URL del Blog"
                      value={parsedConfig?.site?.blog?.url || ""}
                      onChange={(e) => updateJsonField("site.blog.url", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Logo del Blog"
                      value={parsedConfig?.site?.blog?.logo || ""}
                      onChange={(e) => updateJsonField("site.blog.logo", e.target.value)}
                      size="small"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Trip Configuration */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Configuración del Viaje</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Fecha de Inicio (ISO)"
                      value={parsedConfig?.trip?.startISO || ""}
                      onChange={(e) => updateJsonField("trip.startISO", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Banner por Defecto"
                      value={parsedConfig?.defaultBanner || ""}
                      onChange={(e) => updateJsonField("defaultBanner", e.target.value)}
                      size="small"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Cities */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Ciudades</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {parsedConfig?.cities?.map((city: any, index: number) => (
                      <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
                        <Typography variant="subtitle2" mb={1} color="text.secondary">Ciudad {index + 1}</Typography>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            label="Key"
                            value={city?.key || ""}
                            onChange={(e) => updateJsonField(`cities.${index}.key`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Label"
                            value={city?.label || ""}
                            onChange={(e) => updateJsonField(`cities.${index}.label`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Query"
                            value={city?.query || ""}
                            onChange={(e) => updateJsonField(`cities.${index}.query`, e.target.value)}
                            size="small"
                          />
                        </Stack>
                      </Box>
                    ))}
                    <Button 
                      startIcon={<AddIcon />} 
                      variant="outlined" 
                      onClick={() => addArrayItem("cities", { key: "new-city", label: "New City", query: "" })}
                    >
                      Añadir Ciudad
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Itinerary */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Itinerario</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {parsedConfig?.itinerary?.map((item: any, index: number) => (
                      <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
                        <Typography variant="subtitle2" mb={1} color="text.secondary">Destino {index + 1}</Typography>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            label="Ciudad"
                            value={item?.city || ""}
                            onChange={(e) => updateJsonField(`itinerary.${index}.city`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Días"
                            value={item?.days || ""}
                            onChange={(e) => updateJsonField(`itinerary.${index}.days`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Especial"
                            value={item?.special || ""}
                            onChange={(e) => updateJsonField(`itinerary.${index}.special`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Transfer"
                            value={item?.transfer || ""}
                            onChange={(e) => updateJsonField(`itinerary.${index}.transfer`, e.target.value)}
                            size="small"
                          />
                        </Stack>
                      </Box>
                    ))}
                    <Button 
                      startIcon={<AddIcon />} 
                      variant="outlined" 
                      onClick={() => addArrayItem("itinerary", { city: "beijing", days: "1", special: "", transfer: "" })}
                    >
                      Añadir Destino
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Expenses */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Gastos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Presupuesto"
                      type="number"
                      value={parsedConfig?.expenses?.budget || 0}
                      onChange={(e) => updateJsonField("expenses.budget", e.target.value)}
                      size="small"
                    />
                    
                    <Typography variant="subtitle1" color="text.primary">Items</Typography>
                    {parsedConfig?.expenses?.items?.map((item: any, index: number) => (
                      <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
                        <Typography variant="subtitle2" mb={1} color="text.secondary">Item {index + 1}</Typography>
                        <Stack spacing={1}>
                          <TextField
                            fullWidth
                            label="Nombre"
                            value={item?.name || ""}
                            onChange={(e) => updateJsonField(`expenses.items.${index}.name`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Categoría"
                            value={item?.category || ""}
                            onChange={(e) => updateJsonField(`expenses.items.${index}.category`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Cantidad (EUR)"
                            type="number"
                            value={item?.amountEUR || 0}
                            onChange={(e) => updateJsonField(`expenses.items.${index}.amountEUR`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Estado"
                            value={item?.status || ""}
                            onChange={(e) => updateJsonField(`expenses.items.${index}.status`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Ciudad"
                            value={item?.city || ""}
                            onChange={(e) => updateJsonField(`expenses.items.${index}.city`, e.target.value)}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            label="Nota"
                            value={item?.note || ""}
                            onChange={(e) => updateJsonField(`expenses.items.${index}.note`, e.target.value)}
                            size="small"
                          />
                        </Stack>
                      </Box>
                    ))}
                     <Button 
                      startIcon={<AddIcon />} 
                      variant="outlined" 
                      onClick={() => addArrayItem("expenses.items", { name: "New Item", category: "General", amountEUR: 0 })}
                    >
                      Añadir Gasto
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Map Configuration */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Configuración del Mapa</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Centro (lat,lng)"
                      value={parsedConfig?.map?.center?.join(",") || ""}
                      onChange={(e) => updateJsonFieldNumericArray("map.center", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Zoom"
                      type="number"
                      value={parsedConfig?.map?.zoom || 4}
                      onChange={(e) => updateJsonFieldNumeric("map.zoom", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Color de Ruta"
                      value={parsedConfig?.map?.pathColor || "#ef4444"}
                      onChange={(e) => updateJsonField("map.pathColor", e.target.value)}
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Grosor de Ruta"
                      type="number"
                      value={parsedConfig?.map?.pathWeight || 3}
                      onChange={(e) => updateJsonFieldNumeric("map.pathWeight", e.target.value)}
                      size="small"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Box>
          
          {/* Draggable Divider */}
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              width: '10px',
              cursor: 'col-resize',
              backgroundColor: isDragging ? 'primary.main' : 'divider',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
           <Box sx={{ width: 4, height: 40, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          </Box>

          {/* JSON Editor Pane */}
          <Box sx={{ 
            flexGrow: 1,
            width: `${100 - visualWidth}%`, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            pl: 2
          }}>
            <Typography variant="h6" mb={2} color="text.secondary">
              JSON
            </Typography>
            <Stack spacing={2} sx={{ flexGrow: 1, overflow: 'hidden' }}>
              {jsonError && (
                <Alert severity="error" onClose={() => setJsonError(null)}>
                  {jsonError}
                </Alert>
              )}
              
              <TextField
                multiline
                fullWidth
                value={jsonText}
                onChange={(e) => handleJsonTextChange(e.target.value)}
                placeholder="Edita tu configuración JSON aquí..."
                InputProps={{
                  sx: {
                    color: "#e5e7eb",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    backgroundColor: "#1f2937",
                    borderRadius: 1,
                    p: 1,
                    height: '100%',
                    alignItems: 'flex-start',
                    overflowY: 'auto'
                  },
                }}
                InputLabelProps={{
                  sx: { display: 'none' }, // Hide label inside
                }}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  '& .MuiInputBase-root': {
                     height: '100%',
                     padding: 0
                  },
                   '& .MuiInputBase-input': {
                     height: '100% !important',
                     overflow: 'auto !important'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#374151',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4b5563',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#60a5fa',
                    },
                  },
                }}
              />
              
              <Typography variant="body2" color="text.secondary">
                Puedes pegar una configuración JSON completa aquí y se validará automáticamente.
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadJSON}
                fullWidth
                sx={{ mt: 2 }}
              >
                Descargar JSON
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default ConfigEditor