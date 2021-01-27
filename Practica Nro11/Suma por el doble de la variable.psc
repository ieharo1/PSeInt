Algoritmo MultiplosYSuma
	Definir n, i, suma Como Entero
	Escribir "Ingrese un número positivo"
	Leer n
	suma<-n
	sumatoria<-0
	Para i<-1 Hasta n Con Paso 1 Hacer
		Escribir Sin Saltar suma " "
		sumatoria<-suma+sumatoria
		suma<-suma+n
	Fin Para
	Escribir ""
	Escribir "Sumatoria total: " sumatoria
FinAlgoritmo
