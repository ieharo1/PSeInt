Algoritmo DiaDelAnio
	Definir Ndia,Nmes,DDA Como Entero
	Escribir "Escriba el dia"
	Leer Ndia
	Escribir "Escriba el mes"
	Leer Nmes
	Si Ndia>=1 Y Ndia<=31 Y Nmes>=1 Y Nmes <=12 Entonces
		Segun Nmes Hacer
			1:
				DDA<-Ndia
			2:
				DDA<-Ndia+31
			3:
				DDA<-Ndia+59
			4:
				DDA<-Ndia+90
			5:
				DDA<-Ndia+120
		    6:
				DDA<-Ndia+151
			7: 
				DDA<-Ndia+181
			8:
				DDA<-Ndia+212
			9:
				DDA<-Ndia+243
		    10:
				DDA<-Ndia+273
			11:
				DDA<-Ndia+304
			12:
				DDA<-Ndia+334
		Fin Segun
		Escribir"El dia" Ndia ",del " Nmes ",es el dia" DDA "del año"
	SiNo
		Escribir "Datos proporcionados no son válidos"
	Fin Si
	
	
FinAlgoritmo
