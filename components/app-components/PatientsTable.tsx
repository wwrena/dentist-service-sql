"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/format_date"
import { useEffect, useState } from "react"
import { Patient } from "@/types/Patient"
import { api } from "@/lib/axios"
import { api_routes } from "@/constants/app.routes"
import { DropdownActions } from "@/app/patients/components/UserActions.dropdown"
import {
  Dentist,
  DentistOption,
  DentistOptionContext,
  DentistsContext,
  IndexContext,
  PatientsContext,
} from "@/context/PatientsTable.context"
import { PatientVisits } from "@/app/patients/components/PatientVisits.alert"
import CreatePatientRecord from "@/app/patients/components/CreatePatientRecord.alert"
import PatientsFilter from "@/app/patients/components/PatientsFilter.component"

export default function PatientsTable() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [dentistOptions, setDentistOptions] = useState<DentistOption[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    api.get(api_routes.patients).then((response) => {
      setPatients(response.data.data)
    })
    api.get("/options/dentists").then((response) => {
      setDentistOptions(response.data.data)
    })
    api.get("/dentists").then((response) => {
      setDentists(response.data.data)
    })
  }, [])

  const Patient = ({ patient, index }: { patient: Patient; index: number }) => {
    return (
      <TableRow>
        <TableCell className="font-medium">{patient.patient_id}</TableCell>
        <TableCell className="font-medium">{patient.full_name}</TableCell>
        <TableCell className="font-medium capitalize">
          {patient.diagnosis}
        </TableCell>
        <TableCell className="font-medium hover:underline hover:text-blue-400 cursor-pointer">
          <PatientVisits id={patient.patient_id} />
        </TableCell>
        <TableCell className="text-right text-nowrap">
          {formatDate(patient.date_of_birth)}
        </TableCell>
        <TableCell
          className="text-right"
          onMouseOver={() => {
            setIndex(index)
          }}
        >
          <DropdownActions patient={patient} />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <PatientsContext.Provider value={{ patients, setPatients }}>
      <DentistOptionContext.Provider
        value={{ dentistOptions, setDentistOptions }}
      >
        <DentistsContext.Provider value={{ dentists, setDentists }}>
          <IndexContext.Provider value={{ index, setIndex }}>
            <div className="mx-4 flex items-center my-2">
              <PatientsFilter />
              <CreatePatientRecord />
            </div>
            <Table className="select-none">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">id</TableHead>
                  <TableHead className="w-[200px]">Імʼя</TableHead>
                  <TableHead>Діагноз</TableHead>
                  <TableHead className="w-[200px]">Відвідування</TableHead>
                  <TableHead className="text-right text-nowrap">
                    Дата народження
                  </TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients &&
                  patients.map((patient: Patient, index: number) => (
                    <Patient
                      index={index}
                      key={patient?.patient_id}
                      patient={patient}
                    />
                  ))}
              </TableBody>
            </Table>
          </IndexContext.Provider>
        </DentistsContext.Provider>
      </DentistOptionContext.Provider>
    </PatientsContext.Provider>
  )
}
