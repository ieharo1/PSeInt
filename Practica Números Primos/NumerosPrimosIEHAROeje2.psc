Algoritmo NumerosPrimos
	Escribir "Por favor Ingrese número para evaluar"
	Leer n
	Para i<-1 Hasta n Hacer
		Si n%i=0 Entonces
			cont<-cont+1
		SiNo
		Fin Si
	Fin Para
	Si cont=2 Entonces
		Escribir n," es un número primo"
	SiNo
		Escribir n," no es número primo"
	Fin Si
FinAlgoritmo
