Algoritmo Ejercicio2PracticaNro5
	Definir contador,n Como Entero
	Definir dato,sumatoria Como Real
	Escribir '¿Cuátos números va a ingresar?'
	Leer n
	sumatoria <- 0
	Para contador<-1 Hasta n Hacer
		Escribir 'Ingrese el dato No.',contador
		Leer dato
		sumatoria <- dato+sumatoria
	FinPara
	Escribir 'La Sumatoria es:',sumatoria
FinAlgoritmo

