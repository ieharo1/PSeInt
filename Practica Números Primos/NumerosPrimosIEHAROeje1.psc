Algoritmo NumerosPrimos
	Escribir "Ingrese la cantidad de números primos a mostrar"
	Leer cant_a_mostrar
	Escribir "1: 2"
	cant_mostrados <- 1
	n<- 3
	Mientras cant_mostrados<cant_a_mostrar Hacer
		es_primo <- Verdadero
		Para i<-3 Hasta rc(n) Con Paso 2 Hacer
			Si n MOD i = 0 Entonces
				es_primo <- Falso
			Fin Si
		Fin Para
		Si es_primo Entonces
			cant_mostrados <- cant_mostrados + 1
			Escribir cant_mostrados, ": ",n
		Fin Si
		n <- n +2
	Fin Mientras
FinAlgoritmo
