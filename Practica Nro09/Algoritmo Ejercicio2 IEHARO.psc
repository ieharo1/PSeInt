Algoritmo Ejercicio2
	Definir x, y1, s Como Entero
	x<-1
	s<-0
	cont<-0
	Mientras x<3 Hacer
		y1<-1
		Mientras y1<5 Hacer
			s<-x+y1+s
			y1<-y1+1
			cont<-cont+1
		Fin Mientras
		x<-x+1
	Fin Mientras
	Escribir s
	Escribir cont
FinAlgoritmo
