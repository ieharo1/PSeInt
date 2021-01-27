Algoritmo EjecucionConNumerosPrimosSoloConVariable
	Escribir "Ingrese 10 números"
	Leer n
	Si n=1 Entonces
		Escribir "Es un número primo"
    SiNo
		con=0
		Para i<-1 Hasta n Con Paso 1 Hacer
			Si n mod i= 0 Entonces
				con=con+1
			FinSi
		FinPara
		Si con=2 Entonces
			Escribir  n  " Es un numero primo"
		SiNo
			Escribir n  " No es un numero primo"
		FinSi
	FinSi
	
	
FinAlgoritmo
