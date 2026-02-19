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
  Snackbar,
  IconButton,
  Grid,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import DownloadIcon from "@mui/icons-material/Download"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import SaveIcon from "@mui/icons-material/Save"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Editor from "@monaco-editor/react"

dayjs.locale('es');
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
          backgroundImage: 'none',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: '8px 0' },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          color: '#F3F4F6',
          '& .MuiSvgIcon-root': { color: '#9CA3AF' },
        },
      },
    },
  },
})

const ConfigEditor: React.FC<ConfigEditorProps> = ({ initialConfig }) => {
  // State for the configuration object (Visual Editor Source of Truth)
  const [config, setConfig] = useState<any>(initialConfig)
  
  // State for the JSON string (Monaco Editor Source of Truth)
  const [jsonText, setJsonText] = useState(JSON.stringify(initialConfig, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Layout State
  const [visualWidth, setVisualWidth] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  // Notification State
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false })

  // --- Visual Editor Helpers ---

  // Update a field in the config object directly
  const updateConfigField = (path: string, value: any) => {
    setConfig((prevConfig: any) => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig)) // Deep clone
      const keys = path.split('.')
      let current = newConfig
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      
      current[keys[keys.length - 1]] = value
      
      // Sync to JSON Text Immediately
      setJsonText(JSON.stringify(newConfig, null, 2))
      return newConfig
    })
  }

  const addArrayItem = (path: string, defaultItem: any) => {
    setConfig((prevConfig: any) => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig))
      const keys = path.split('.')
      let current = newConfig
      
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (!current[key]) current[key] = []
        current = current[key]
      }
      
      if (Array.isArray(current)) {
        current.push(defaultItem)
        setJsonText(JSON.stringify(newConfig, null, 2))
      }
      return newConfig
    })
  }

  const removeArrayItem = (path: string, index: number) => {
    setConfig((prevConfig: any) => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig))
      const keys = path.split('.')
      let current = newConfig

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (!current[key]) return prevConfig // Path not found
        current = current[key]
      }

      if (Array.isArray(current)) {
        current.splice(index, 1)
        setJsonText(JSON.stringify(newConfig, null, 2))
      }
      return newConfig
    })
  }

  // --- Map Helper Functions ---
  const updateMapKey = (path: string, oldKey: string, newKey: string) => {
    if (!newKey || oldKey === newKey) return
    setConfig((prevConfig: any) => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig))
      const keys = path.split('.')
      let current = newConfig
      for (const key of keys) {
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      
      const value = current[oldKey]
      delete current[oldKey]
      current[newKey] = value
      setJsonText(JSON.stringify(newConfig, null, 2))
      return newConfig
    })
  }

  const addMapKey = (path: string, key: string, defaultValue: any) => {
    setConfig((prevConfig: any) => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig))
      const keys = path.split('.')
      let current = newConfig
      for (const key of keys) {
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      
      if (!current[key]) {
        current[key] = defaultValue
        setJsonText(JSON.stringify(newConfig, null, 2))
      }
      return newConfig
    })
  }

  const removeMapKey = (path: string, key: string) => {
    setConfig((prevConfig: any) => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig))
      const keys = path.split('.')
      let current = newConfig
      for (const key of keys) {
        if (!current[key]) return prevConfig
        current = current[key]
      }
      
      delete current[key]
      setJsonText(JSON.stringify(newConfig, null, 2))
      return newConfig
    })
  }

  // --- JSON Editor Helpers ---
  const handleEditorChange = (value: string | undefined) => {
    const text = value || ""
    setJsonText(text)
    try {
      const parsed = JSON.parse(text)
      setJsonError(null)
      setConfig(parsed) // Sync back to visual editor
    } catch (e) {
      setJsonError((e as Error).message)
    }
  }

  // --- Actions ---
  const handleSave = async () => {
    try {
      // Use current config state to ensure we save the latest valid object
      let payload = config;
      try {
        const fromJson = JSON.parse(jsonText)
        payload = fromJson
      } catch (e) {
        // use existing config
      }

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save")
      
      setSnackbar({ open: true, message: '¡Configuración guardada correctamente!', severity: 'success' })
    } catch (err) {
      console.error(err)
      setSnackbar({ open: true, message: 'Error al guardar la configuración', severity: 'error' })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        updateConfigField(path, data.url);
        setSnackbar({ open: true, message: 'Imagen subida correctamente', severity: 'success' });
    } catch (error) {
        console.error(error);
        setSnackbar({ open: true, message: 'Error al subir la imagen', severity: 'error' });
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "travel.config.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  // --- Resizing Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newWidth = (e.clientX / window.innerWidth) * 100
      if (newWidth > 20 && newWidth < 80) setVisualWidth(newWidth)
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Helper to safely get value from config
  const getValue = (path: string, fallback: any = "") => {
    const keys = path.split('.')
    let current = config
    for (const key of keys) {
      if (current === undefined || current === null) return fallback
      current = current[key]
    }
    return current !== undefined ? current : fallback
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
          
          {/* Main Content Area */}
          <Box sx={{ display: 'flex', flexDirection: { sm: 'column', md: 'row' }, flexGrow: 1, overflow: 'hidden', gap: 0 }}>
            {/* Visual Editor Pane */}
            <Box sx={{ 
              width: { sm: '100%', md: `${visualWidth}%` }, 
              flexGrow: 1,
              display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 2 
            }}>
              <Typography variant="h6" mb={2} color="text.secondary">Editor Visual</Typography>
              <Stack spacing={3} pb={4}>
                
                {/* Trip Name and Info */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                     <Typography variant="h6">Información General</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth label="Nombre del Viaje (ID Interno)" size="small"
                        value={config.travelName || ""}
                        onChange={(e) => updateConfigField("travelName", e.target.value)}
                        helperText="Identificador único para la base de datos (Ej: VIAJE_2026)"
                      />
                      <DateTimePicker 
                        label="Fecha de Inicio"
                        format="DD/MM/YYYY HH:mm"
                        value={config.trip?.startISO ? dayjs(config.trip.startISO) : null}
                        onChange={(newValue) => updateConfigField("trip.startISO", newValue ? newValue.toISOString() : "")}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                      />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Site Configuration */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Configuración del Sitio</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField fullWidth label="Logo" size="small" value={config.site?.logo || ""} onChange={(e) => updateConfigField("site.logo", e.target.value)} />
                      <TextField fullWidth label="Título" size="small" value={config.site?.title || ""} onChange={(e) => updateConfigField("site.title", e.target.value)} />
                      <TextField fullWidth label="Subtítulo" size="small" value={config.site?.subtitle || ""} onChange={(e) => updateConfigField("site.subtitle", e.target.value)} />
                      <TextField fullWidth label="Banner por Defecto" size="small" value={config.site?.defaultBanner || ""} onChange={(e) => updateConfigField("site.defaultBanner", e.target.value)} />
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>Blog</Typography>
                      <Grid container spacing={2}>
                          <Grid item xs={6}>
                              <TextField fullWidth label="Nombre del Blog" size="small" value={config.site?.blog?.name || ""} onChange={(e) => updateConfigField("site.blog.name", e.target.value)} />
                          </Grid>
                          <Grid item xs={6}>
                              <TextField fullWidth label="URL del Blog" size="small" value={config.site?.blog?.url || ""} onChange={(e) => updateConfigField("site.blog.url", e.target.value)} />
                          </Grid>
                          <Grid item xs={12}>
                              <TextField fullWidth label="Logo del Blog" size="small" value={config.site?.blog?.logo || ""} onChange={(e) => updateConfigField("site.blog.logo", e.target.value)} />
                          </Grid>
                      </Grid>
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
                      {config.cities?.map((city: any, index: number) => (
                        <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                           <IconButton size="small" onClick={() => removeArrayItem("cities", index)} sx={{ position: 'absolute', top: 5, right: 5, color: 'error.main' }}>
                             <DeleteIcon fontSize="small" />
                           </IconButton>
                          <Typography variant="subtitle2" mb={1} color="text.secondary">Ciudad {index + 1}</Typography>
                          <Stack spacing={1}>
                            <TextField fullWidth label="Key (ID)" size="small" value={city?.key || ""} onChange={(e) => updateConfigField(`cities.${index}.key`, e.target.value)} />
                            <TextField fullWidth label="Etiqueta" size="small" value={city?.label || ""} onChange={(e) => updateConfigField(`cities.${index}.label`, e.target.value)} />
                            <TextField fullWidth label="Query Búsqueda" size="small" value={city?.query || ""} onChange={(e) => updateConfigField(`cities.${index}.query`, e.target.value)} />
                          </Stack>
                        </Box>
                      ))}
                      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addArrayItem("cities", { key: "new-city", label: "New City", query: "" })}>
                        Añadir Ciudad
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

              {/* Flights */}
               <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Vuelos</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      {config.flights?.map((flightGroup: any, groupIndex: number) => (
                        <Box key={groupIndex} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                          <IconButton size="small" onClick={() => removeArrayItem("flights", groupIndex)} sx={{ position: 'absolute', top: 5, right: 5, color: 'error.main' }}>
                             <DeleteIcon fontSize="small" />
                          </IconButton>
                          <TextField 
                              fullWidth label="Título del Grupo (Ida/Vuelta)" size="small" variant="standard"
                              value={flightGroup.title || ""} 
                              onChange={(e) => updateConfigField(`flights.${groupIndex}.title`, e.target.value)} 
                              sx={{ mb: 2 }}
                          />
                          
                          <Typography variant="subtitle2" mb={1}>Segmentos</Typography>
                          {flightGroup.segments?.map((segment: any, segIndex: number) => (
                              <Box key={segIndex} sx={{ ml: 2, mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                  <Stack spacing={1}>
                                      <TextField fullWidth label="Título (Ruta)" size="small" value={segment.title || ""} onChange={(e) => updateConfigField(`flights.${groupIndex}.segments.${segIndex}.title`, e.target.value)} />
                                      <Grid container spacing={1}>
                                          <Grid item xs={6}><TextField fullWidth label="Detalle (Fecha)" size="small" value={segment.detail || ""} onChange={(e) => updateConfigField(`flights.${groupIndex}.segments.${segIndex}.detail`, e.target.value)} /></Grid>
                                          <Grid item xs={6}><TextField fullWidth label="Duración" size="small" value={segment.duration || ""} onChange={(e) => updateConfigField(`flights.${groupIndex}.segments.${segIndex}.duration`, e.target.value)} /></Grid>
                                          <Grid item xs={6}><TextField fullWidth label="Compañía" size="small" value={segment.company || ""} onChange={(e) => updateConfigField(`flights.${groupIndex}.segments.${segIndex}.company`, e.target.value)} /></Grid>
                                          <Grid item xs={6}><TextField fullWidth label="Avión" size="small" value={segment.plane || ""} onChange={(e) => updateConfigField(`flights.${groupIndex}.segments.${segIndex}.plane`, e.target.value)} /></Grid>
                                      </Grid>
                                  </Stack>
                              </Box>
                          ))}
                        </Box>
                      ))}
                      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addArrayItem("flights", { title: "Nuevo Trayecto", segments: [] })}>
                        Añadir Grupo de Vuelos
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Airline Logos */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Aerolíneas (Logos)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Edita los logos de las aerolíneas. La clave debe coincidir con el nombre de la compañía en los vuelos.
                            </Alert>
                            {config.airlineLogos && Object.entries(config.airlineLogos).map(([airline, logoUrl], index) => (
                                <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                                    <IconButton size="small" onClick={() => removeMapKey("airlineLogos", airline)} sx={{ position: 'absolute', top: 5, right: 5, color: 'error.main' }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    <Stack spacing={1}>
                                        <TextField 
                                            fullWidth 
                                            label="Nombre Aerolínea (Clave)" 
                                            size="small" 
                                            value={airline} 
                                            onBlur={(e) => updateMapKey("airlineLogos", airline, e.target.value)}
                                            helperText="Cambia esto para renombrar la aerolínea"
                                        />
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <TextField 
                                                fullWidth 
                                                label="URL del Logo" 
                                                size="small" 
                                                value={logoUrl as string} 
                                                onChange={(e) => updateConfigField(`airlineLogos.${airline}`, e.target.value)} 
                                            />
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ minWidth: 120, height: 40 }}
                                            >
                                                Subir
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, `airlineLogos.${airline}`)}
                                                />
                                            </Button>
                                        </Box>
                                        {(logoUrl as string) && (
                                            <Box sx={{ mt: 1, p: 1, bgcolor: 'white', borderRadius: 1, width: 'fit-content' }}>
                                                <img src={logoUrl as string} alt={airline} style={{ height: 40, maxWidth: 200, objectFit: 'contain' }} />
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            ))}
                            <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addMapKey("airlineLogos", "Nueva Aerolínea", "")}>
                                Añadir Aerolínea
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
                      {config.itinerary?.map((item: any, index: number) => (
                        <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                           <IconButton size="small" onClick={() => removeArrayItem("itinerary", index)} sx={{ position: 'absolute', top: 5, right: 5, color: 'error.main' }}>
                             <DeleteIcon fontSize="small" />
                           </IconButton>
                          <Typography variant="subtitle2" mb={1} color="text.secondary">Destino {index + 1}</Typography>
                          <Stack spacing={1}>
                            <TextField fullWidth label="Ciudad" size="small" value={item?.city || ""} onChange={(e) => updateConfigField(`itinerary.${index}.city`, e.target.value)} />
                            <TextField fullWidth label="Días" size="small" value={item?.days || ""} onChange={(e) => updateConfigField(`itinerary.${index}.days`, e.target.value)} />
                            <TextField fullWidth label="Especial" size="small" value={item?.special || ""} onChange={(e) => updateConfigField(`itinerary.${index}.special`, e.target.value)} />
                            <TextField fullWidth label="Transfer" size="small" value={item?.transfer || ""} onChange={(e) => updateConfigField(`itinerary.${index}.transfer`, e.target.value)} />
                          </Stack>
                        </Box>
                      ))}
                      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addArrayItem("itinerary", { city: "beijing", days: "1", special: "", transfer: "" })}>
                        Añadir Destino
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Stops (Map Markers) */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Paradas (Mapa)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Stack spacing={2}>
                      {config.stops?.map((stop: any, index: number) => (
                          <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                              <IconButton size="small" onClick={() => removeArrayItem("stops", index)} sx={{ position: 'absolute', top: 5, right: 5, color: 'error.main' }}>
                                  <DeleteIcon fontSize="small" />
                              </IconButton>
                              <Stack spacing={1}>
                                  <TextField fullWidth label="Nombre (Opcional)" size="small" value={stop.name || ""} onChange={(e) => updateConfigField(`stops.${index}.name`, e.target.value)} />
                                  <Stack direction="row" spacing={1}>
                                      <TextField fullWidth label="Latitud" size="small" type="number" value={stop.coords?.[0] || 0} onChange={(e) => updateConfigField(`stops.${index}.coords.0`, Number(e.target.value))} />
                                      <TextField fullWidth label="Longitud" size="small" type="number" value={stop.coords?.[1] || 0} onChange={(e) => updateConfigField(`stops.${index}.coords.1`, Number(e.target.value))} />
                                  </Stack>
                              </Stack>
                          </Box>
                      ))}
                      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addArrayItem("stops", { name: "Nueva Parada", coords: [0, 0] })}>
                          Añadir Parada
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
                      <TextField fullWidth label="Centro (lat,lng)" value={config.map?.center?.join(",") || ""} onChange={(e) => updateConfigField("map.center", e.target.value.split(',').map(Number))} size="small" />
                      <TextField fullWidth label="Zoom" type="number" value={config.map?.zoom || 4} onChange={(e) => updateConfigField("map.zoom", Number(e.target.value))} size="small" />
                      <TextField fullWidth label="Color de Ruta" value={config.map?.pathColor || "#ef4444"} onChange={(e) => updateConfigField("map.pathColor", e.target.value)} size="small" />
                      <TextField fullWidth label="Grosor de Ruta" type="number" value={config.map?.pathWeight || 3} onChange={(e) => updateConfigField("map.pathWeight", Number(e.target.value))} size="small" />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Interactive Background */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Fondo Interactivo</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            <Typography variant="subtitle2" color="text.secondary">Parámetros Generales</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><TextField fullWidth label="Cantidad" type="number" size="small" value={config.interactiveBackground?.count || 20} onChange={(e) => updateConfigField("interactiveBackground.count", Number(e.target.value))} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Opacidad" type="number" size="small" value={config.interactiveBackground?.opacity || 0.3} onChange={(e) => updateConfigField("interactiveBackground.opacity", Number(e.target.value))} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Velocidad Min" type="number" size="small" value={config.interactiveBackground?.speedMin || 0.1} onChange={(e) => updateConfigField("interactiveBackground.speedMin", Number(e.target.value))} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Velocidad Max" type="number" size="small" value={config.interactiveBackground?.speedMax || 0.4} onChange={(e) => updateConfigField("interactiveBackground.speedMax", Number(e.target.value))} /></Grid>
                            </Grid>
                            <TextField fullWidth label="Iconos (Array)" size="small" value={JSON.stringify(config.interactiveBackground?.icons || [])} onChange={(e) => {
                                try { updateConfigField("interactiveBackground.icons", JSON.parse(e.target.value)) } catch(e){}
                            }} helperText="Edita como JSON array: ['mdi:icon1', 'mdi:icon2']" />
                            <TextField fullWidth label="Hanzi (Array)" size="small" value={JSON.stringify(config.interactiveBackground?.hanzi || [])} onChange={(e) => {
                                try { updateConfigField("interactiveBackground.hanzi", JSON.parse(e.target.value)) } catch(e){}
                            }} helperText="Edita como JSON array: ['中', '国']" />
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Expenses Categories */}
                <Accordion>
                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                     <Typography variant="h6">Categorías de Gastos</Typography>
                   </AccordionSummary>
                   <AccordionDetails>
                     <Stack spacing={2}>
                       {config.expenses?.categories?.map((cat: any, index: number) => (
                         <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                           <IconButton size="small" onClick={() => removeArrayItem("expenses.categories", index)} sx={{ position: 'absolute', top: 5, right: 5, color: 'error.main' }}>
                             <DeleteIcon fontSize="small" />
                           </IconButton>
                           <Stack spacing={1}>
                              <TextField fullWidth label="Nombre" size="small" value={cat.name || ""} onChange={(e) => updateConfigField(`expenses.categories.${index}.name`, e.target.value)} />
                              <TextField fullWidth label="Descripción" size="small" value={cat.description || ""} onChange={(e) => updateConfigField(`expenses.categories.${index}.description`, e.target.value)} />
                              <TextField fullWidth label="Color (Hex)" size="small" type="color" value={cat.color || "#000000"} onChange={(e) => updateConfigField(`expenses.categories.${index}.color`, e.target.value)} sx={{ '& input': { height: 40 } }} />
                           </Stack>
                         </Box>
                       ))}
                       <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addArrayItem("expenses.categories", { name: "Nueva Categoría", description: "", color: "#ffffff" })}>
                         Añadir Categoría
                       </Button>
                     </Stack>
                   </AccordionDetails>
                </Accordion>

                {/* Expenses Items */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Gastos (Items)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField fullWidth label="Presupuesto Total" type="number" size="small" value={config.expenses?.budget || 0} onChange={(e) => updateConfigField("expenses.budget", Number(e.target.value))} />
                      
                      {config.expenses?.items?.map((item: any, index: number) => (
                        <Box key={index} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                          <IconButton size="small" onClick={() => removeArrayItem("expenses.items", index)} sx={{ position: 'absolute', top: 5, right: 5, color: 'error.main' }}>
                             <DeleteIcon fontSize="small" />
                           </IconButton>
                          <Stack spacing={1}>
                            <TextField fullWidth label="Nombre" size="small" value={item.name || ""} onChange={(e) => updateConfigField(`expenses.items.${index}.name`, e.target.value)} />
                            <TextField fullWidth label="Ciudad" size="small" value={item.city || ""} onChange={(e) => updateConfigField(`expenses.items.${index}.city`, e.target.value)} />
                            <TextField fullWidth label="Categoría" size="small" value={item.category || ""} onChange={(e) => updateConfigField(`expenses.items.${index}.category`, e.target.value)} />
                            <TextField fullWidth label="Cantidad (EUR)" type="number" size="small" value={item.amountEUR || 0} onChange={(e) => updateConfigField(`expenses.items.${index}.amountEUR`, Number(e.target.value))} />
                            <TextField fullWidth label="Estado" size="small" value={item.status || ""} onChange={(e) => updateConfigField(`expenses.items.${index}.status`, e.target.value)} />
                            
                            <DateTimePicker 
                                label="Fecha y Hora"
                                format="DD/MM/YYYY HH:mm"
                                value={item.date ? dayjs(item.date) : null}
                                onChange={(newValue) => updateConfigField(`expenses.items.${index}.date`, newValue ? newValue.toISOString() : "")}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />

                            <FormControlLabel
                                control={
                                  <Switch 
                                    checked={item.showInCarousel !== false} // Default to true if undefined
                                    onChange={(e) => updateConfigField(`expenses.items.${index}.showInCarousel`, e.target.checked)} 
                                  />
                                }
                                label="Mostrar en Carrusel"
                            />

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField 
                                    fullWidth label="Imagen (URL)" size="small" 
                                    value={item.image || ""} 
                                    onChange={(e) => updateConfigField(`expenses.items.${index}.image`, e.target.value)} 
                                />
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ minWidth: 120, height: 40 }}
                                >
                                    Subir
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, `expenses.items.${index}.image`)}
                                    />
                                </Button>
                            </Box>
                          </Stack>
                        </Box>
                      ))}
                      <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addArrayItem("expenses.items", { name: "Nuevo Gasto", category: "General", amountEUR: 0 })}>
                        Añadir Gasto
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

              </Stack>
            </Box>

            {/* Divider */}
            <Box
              onMouseDown={handleMouseDown}
              sx={{
                width: '10px', cursor: 'col-resize', bgcolor: isDragging ? 'primary.main' : 'divider',
                display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', zIndex: 10
              }}
            >
             <Box sx={{ width: 4, height: 40, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
            </Box>

            {/* JSON Editor Pane with Monaco */}
            <Box sx={{ flexGrow: 1, width: { xs: '100%', md: `${100 - visualWidth}%` }, display: 'flex', flexDirection: 'column', p: 2 }}>
              <Typography variant="h6" mb={2} color="text.secondary">JSON</Typography>
              
              {jsonError && <Alert severity="error" sx={{ mb: 2 }}>{jsonError}</Alert>}

              <Box sx={{ flexGrow: 1, border: '1px solid #374151', borderRadius: 1, overflow: 'hidden' }}>
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={jsonText}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: 'on'
                  }}
                />
              </Box>

              <Stack direction="row" spacing={2} mt={2}>
                <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} fullWidth>
                  Guardar Cambios
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadJSON} fullWidth>
                  Descargar
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Notification Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default ConfigEditor