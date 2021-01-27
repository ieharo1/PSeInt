Algoritmo SumatoriaYMenor
	Definir suma, x, aux Como Real
	Definir i, n Como Entero
	Escribir "¿Cuántos números va a ingresar?"
	Leer n
	Si n>=1 Entonces
		Escribir "Ingrese el valor 1"
		Leer x
		aux<-x
		suma<-x
		Para i<-1 Hasta n-1 Con Paso 1 Hacer
			Escribir "Ingrese el valor " i+1
			Leer x
			suma<-suma+x
			Si aux>x Entonces
				aux<-x
			FinSi
		Fin Para
		Escribir "La sumatoria es: " suma
		Escribir "El menor valor ingresado es: " aux
	SiNo
		Escribir "Ingrese un número natural válido"
	FinSi
FinAlgoritmo
