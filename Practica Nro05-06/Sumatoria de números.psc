Algoritmo Ejercicio2PracticaNro5
	Definir contador,n Como Entero
	Definir dato,sumatoria Como Real
	Escribir '¿Cuátos números va a ingresar?'
	Leer n
	contador <- 1
	sumatoria <- 0
	Mientras contador<=n Hacer
		Escribir 'Ingrese el dato No.',contador
		Leer dato
		sumatoria <- dato+sumatoria
		contador <- contador+1
	FinMientras
	Escribir 'La Sumatoria es:',sumatoria
FinAlgoritmo

