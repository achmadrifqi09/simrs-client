"use client";
import Section from "@/components/ui/section";
import { useToast } from "@/hooks/use-toast";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import React, { useState } from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MinusCircle, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

const Registration = () => {
  const { toast } = useToast();
  const [goal, setGoal] = useState(350);
  const [activeTab, setActiveTab] = useState("BPJS");

  const dataBPJS = [
    {
      no: 1,
      kode_rm: "1968189",
      no_antrean: "B-1",
      kode_booking: "24090901",
      nama: "ARYA KHRISNA SATIRA WARDHANA",
      poliklinik: "ANAK",
      dokter: "dr. Husnul Asariati, Sp.A. Biomed",
    },
    {
      no: 2,
      kode_rm: "1968188",
      no_antrean: "B-2",
      kode_booking: "24090902",
      nama: "MUHAMMAD ARIBY ZAHRON",
      poliklinik: "PARU",
      dokter: "Dr. Wara Pertiwi, Sp.P",
    },
  ];

  const dataUmum = [
    {
      no: 1,
      kode_rm: "1968181",
      no_antrean: "C-1",
      kode_booking: "24090901",
      nama: "INDAH DYASWATI HANANY",
      poliklinik: "ANAK",
      dokter: "dr. Husnul Asariati, Sp.A. Biomed",
    },
    {
      no: 2,
      kode_rm: "1968122",
      no_antrean: "C-2",
      kode_booking: "24090902",
      nama: "Hanif Rahmannur Rosyid",
      poliklinik: "PARU",
      dokter: "Dr. Wara Pertiwi, Sp.P",
    },
  ];

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  const handleToast = () => {
    toast({
      title: "Notification",
      description: "testing toast message",
    });
  };
  return (
    <>
      <Heading headingLevel="h3" variant="page-title">
        Pendaftaran
      </Heading>

      <div className="space-y-6">
        <Section>
          <Heading headingLevel="h5">Pendaftar Layanan</Heading>
          <div className="px-6 pb-6 flex-1 overflow-auto mt-4">
            <Tabs defaultValue="BPJS">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="BPJS">Pasien BPJS</TabsTrigger>
                <TabsTrigger value="Umum">Pasien Umum</TabsTrigger>
              </TabsList>
              <TabsContent value="BPJS" className="mt-6 px-1"></TabsContent>
              <TabsContent value="Umum" className="mt-6 px-1"></TabsContent>
            </Tabs>
          </div>
          {/* <div className="flex space-x-1 bg-red-100 p-1 rounded-md">
            <Button
              className={`flex-1 ${
                activeTab === "BPJS"
                  ? ""
                  : "bg-red-100 text-gray-500 hover:text-white"
              }`}
              onClick={() => setActiveTab("BPJS")}
            >
              Pasien BPJS
            </Button>
            <Button
              className={`flex-1 ${
                activeTab === "Umum"
                  ? ""
                  : "bg-red-100 text-gray-500 hover:text-white"
              }`}
              onClick={() => setActiveTab("Umum")}
            >
              Pasien Umum
            </Button>
          </div> */}

          <div className="my-7">
            <div className="my-3 flex justify-end">
              <Input className="max-w-72" placeholder="Cari pasien..." />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead className="text-center">Kode RM</TableHead>
                  <TableHead className="text-center">No Antrean</TableHead>
                  <TableHead className="text-center">Kode Booking</TableHead>
                  <TableHead className="text-center">Nama Pasien</TableHead>
                  <TableHead className="text-center">Poliklinik</TableHead>
                  <TableHead className="text-center">Dokter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTab === "BPJS"
                  ? dataBPJS.map((item) => (
                      <TableRow
                        key={item.no}
                        className="text-center text-gray-500"
                      >
                        <TableCell>{item.no}</TableCell>
                        <TableCell>{item.kode_rm}</TableCell>
                        <TableCell>{item.no_antrean}</TableCell>
                        <TableCell>{item.kode_booking}</TableCell>
                        <TableCell className="text-left">{item.nama}</TableCell>
                        <TableCell>{item.poliklinik}</TableCell>
                        <TableCell className="text-left">
                          {item.dokter}
                        </TableCell>
                      </TableRow>
                    ))
                  : dataUmum.map((item) => (
                      <TableRow
                        key={item.no}
                        className="text-center text-gray-500"
                      >
                        <TableCell>{item.no}</TableCell>
                        <TableCell>{item.kode_rm}</TableCell>
                        <TableCell>{item.no_antrean}</TableCell>
                        <TableCell>{item.kode_booking}</TableCell>
                        <TableCell className="text-left">{item.nama}</TableCell>
                        <TableCell>{item.poliklinik}</TableCell>
                        <TableCell className="text-left">
                          {item.dokter}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <Pagination className="my-5">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Section>

        <Section>
          <Heading headingLevel="h5">
            Popup (dialog, toast, drawer, sheet)
          </Heading>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={handleToast}>Toast</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Dialog</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Example Dialog</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when youre
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input id="username" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Drawer>
              <DrawerTrigger asChild>
                <Button>Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Move Goal</DrawerTitle>
                    <DrawerDescription>
                      Set your daily activity goal.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => onClick(-10)}
                        disabled={goal <= 200}
                      >
                        <MinusCircle className="h-4 w-4" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-7xl font-bold tracking-tighter">
                          {goal}
                        </div>
                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                          Calories/day
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => onClick(10)}
                        disabled={goal >= 400}
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                    <div className="mt-3 h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                          <Bar
                            dataKey="goal"
                            style={
                              {
                                fill: "hsl(var(--foreground))",
                                opacity: 0.9,
                              } as React.CSSProperties
                            }
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            <Sheet>
              <SheetTrigger asChild>
                <Button>Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you done.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input id="username" className="col-span-3" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Alert</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Section>
      </div>
    </>
  );
};

export default Registration;
