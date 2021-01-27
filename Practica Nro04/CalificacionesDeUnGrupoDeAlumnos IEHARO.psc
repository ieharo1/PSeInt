Algoritmo CalificacionesDeUnGrupoDeAlumnos
	Definir nombr_alumn Como Caracter
	Definir nota_prct,nota_probl,nota_teor,rsltd Como Real
	Repetir
		Escribir 'Ingrese el nombre del alumno'
		Leer nombr_alumn
		Si nombr_alumn!='' Entonces
			Escribir 'Ingrese la nota de la practica obtenida por',nombr_alumn
			Leer nota_prct
			Escribir 'Ingrese la nota de la problema obtenida por',nombr_alumn
			Leer nota_probl
			Escribir 'Ingrese la nota de la teoria obtenida por',nombr_alumn
			Leer nota_teor
			Si (nota_prct>=0 Y nota_prct<=10) Y (nota_probl>=0 Y nota_probl<=10) Y (nota_teor>=0 Y nota_teor<=10) Entonces
				rsltd <- nota_prct*0.1+nota_probl*0.5+nota_teor*0.4
				Escribir 'La nota final del alumno',nombr_alumn,'es: ',rsltd
				Escribir 'xxxx'
			SiNo
				Escribir 'Las notas deben estar entre 0 y 10, ingrese nuevamente'
			FinSi
		FinSi
	Hasta Que nombr_alumn=''
FinAlgoritmo

