SubAlgoritmo Subrayar(x)
	Para i<-1 Hasta Longitud(x)+5 Con Paso 1 Hacer
		Escribir Sin Saltar "-"
	Fin Para
	Escribir " "
FinSubAlgoritmo

Subalgoritmo mensaje(x)
	Escribir "Hola " x
FinSubAlgoritmo

SubAlgoritmo despedida(x)
	Escribir "Hasta luego " x 
FinSubAlgoritmo

Algoritmo Saludar 
	Escribir "¿Cuál es su nombre?"
	Leer nombre 
	mensaje(nombre)
	Subrayar(nombre)
	despedida(nombre)
FinAlgoritmo
