Alephsys Lab Covid-19 Simulator
========

The Alephsys Lab is part of the Department of Computer Engineering and Mathematics at the "Universitat Rovira i Virgili" 
of Tarragona. The core of our research activity is aimed at investigating the laws governing the structure and dynamics 
of complex networked systems.

[Alephsyslab Web page](https://alephsyslab.com/)

The Covid-19 simulator is a model created by the Alephsyslab research group of the Rovira i Virgili University. 
Its purpose is to simulate the spread of the Covid-19 virus in Catalonia at the county level. 
The user can enter how many simulation timesteps (days), the confinement policies and the zero patient.

The model is available for use in [Alephsyslab Covid-19 Simulator](https://simulator.alephsyslab.com/) 
It is recommended to use Firefox or Chrome for its use.

The implementation of the model used can be found here [Covid-19 Model](https://github.com/jtmatamalas/MMCAcovid19.jl) 

The model documentation can be found here [Covid-19 Model Documentation](https://jtmatamalas.github.io/MMCAcovid19.jl/v0.1/)


 
Research Group
==========

[<img src="https://github.com/dandybit/covid_19_alephsyslab_seeslab/blob/master/readme_images/logo_alephsys.png?raw=true" width="320"/>](https://alephsyslab.com/)
[<img src="https://github.com/dandybit/covid_19_alephsyslab_seeslab/blob/master/readme_images/urv-bandera-color.png?raw=true" width="532"/>](https://www.urv.cat)

How to use
=================

Initially, when the web is accessed, the model has a simulation configuration by default. 
The default configuration does not have any restrictions and patient zero is located in the Alta Ribagorça region.

Use the menu on the left to add confinements. It defines a range of timesteps for the confinement and then its characteristics.

* Mobility reduction.
* Permeability of confined households.
* Social distancing.

All characteristics have a range [0-1]

[<img src="https://github.com/dandybit/covid_19_alephsyslab_seeslab/blob/master/readme_images/confinaments_menu.png?raw=true" width="180"/>](https://www.urv.cat)

