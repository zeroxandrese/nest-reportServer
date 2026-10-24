import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payslip } from './entities/paid-certificate.entity';
import { PaySlipSaw } from './entities/payslipsaw.entity';
import { PrinterService } from 'src/printer/printer.service';
import { getPayslipReport, PayslipProps } from 'src/reports';

@Injectable()
export class PaidCertificatesService {
  constructor(
    @Inject('PAYSLIP_REPOSITORY')
    private readonly repo: Repository<Payslip>,
    @Inject('PAYSLIPSAW_REPOSITORY')
    private readonly sawRepo: Repository<PaySlipSaw>,
    private readonly printerService: PrinterService
  ) {}

  async certificateSalesForDni(documento: string, ciclo: string) {
    const payslip = await this.repo.findOne({
      where: { Documento: documento, Ciclo: ciclo },
    });

    if (!payslip) return;

    const pdfData: PayslipProps = {
      Empresa: payslip.Empresa ?? '',

      ApellidosNombres: payslip.ApellidosNombres ?? '',
      Documento: payslip.Documento ?? '',
      Cargo: payslip.Cargo ?? '',
      Situacion: payslip.Situacion ?? '',
      FechaIngreso: payslip.FechaIngreso ?? null,

      Periodo: ciclo,

      TipoTrabajador: payslip.TipoTrabajador ?? '',
      RegimenPensionario: payslip.RegimenPensionario ?? '',
      CUSPP: payslip.CUSPP ?? '',
      Condicion: payslip.Condicion ?? '',

      DiasLaborados: payslip.DiasLaborados ?? 0,
      DiasNoLaborados: payslip.DiasNoLaborados ?? 0,
      DiasSubsidiados: payslip.DiasSubsidiados ?? 0,

      JOTotalHoras: payslip.JOTotalHoras ?? 0,
      JOMinutos: payslip.JOMinutos ?? 0,
      STTotalHoras: payslip.STTotalHoras ?? 0,
      STMinutos: payslip.STMinutos ?? 0,

      MSLTipo: payslip.MSLTipo ?? '',
      MSLMotivo: payslip.MSLMotivo ?? '',
      MSLDias: payslip.MSLDias ?? 0,

      OtrosEmpleadoresRenta5taCategoria:
        payslip.OtrosEmpleadoresRenta5taCategoria ?? '',

      RemuneracionBasica: Number(payslip.RemuneracionBasica) || 0,
      ComisionesODestajos: Number(payslip.ComisionesODestajos) || 0,
      VacacionesTruncas: Number(payslip.VacacionesTruncas) || 0,

      BonificacionExtra: Number(payslip.BonifExtraProp2935130334) || 0,
      Gratificacion: Number(payslip.GratificacionProp2935130334) || 0,
      Utilidades: Number(payslip.ReparticionUtilidades) || 0,

      CompensacionTiempoServicio:
        Number(payslip.CompensacionTimpoServicio) || 0,

      CompensacionVacacional:
        Number(payslip.CompensacionVacacional) || 0,

      CondicionesTrabajo:
        Number(payslip.CondicionesTrabajo) || 0,

      DinamicasTrabajo:
        Number(payslip.DinamicasTrabajo) || 0,

      BonoCapacitacion:
        Number(payslip.BonoCapacitacion) || 0,

      OtrosDescNoDeducBASEIMPONIB:
        Number(payslip.OtrosDescNoDeducBASEIMPONIB) || 0,

      RemuneracionMes: Number(payslip.RemuneracionMes) || 0,

      Tardanzas: Number(payslip.Tardanzas) || 0,
      Inasistencias: Number(payslip.Inasistencias) || 0,
      Adelanto: Number(payslip.Adelanto) || 0,

      ComisionAFPPorcentual: Number(payslip.ComisionAFPPorcentual) || 0,
      AFPObligatorio: Number(payslip.SPPAportacionObligatoria) || 0,
      PrimaSeguroAFP: Number(payslip.PrimaSeguroAFP) || 0,

      SistemaNACPensionesDL19990:
        Number(payslip.SistemaNACPensionesDL19990) || 0,

      RentaQuinta:
        Number(payslip.RentaQuintaCategoriaRetenciones) || 0,

      PolizaSeguro:
        Number(payslip.PolizaSeguroDLEG688) || 0,

      Essalud:
        Number(payslip.ESSALUDTrab) || 0,

      NetoPagar:
        Number(payslip.NetoaPagar) || 0,
    };

    const docDefinition = getPayslipReport(pdfData);

    const doc = this.printerService.createPdf(docDefinition);

    return doc;
  }

  async registerPayslipView(documento: string, ciclo: string) {

    const exists = await this.sawRepo.findOne({
      where: {
        Documento: documento,
        Ciclo: ciclo
      }
    });
  
    if (!exists) {
  
      const saw = this.sawRepo.create({
        Documento: documento,
        Ciclo: ciclo,
        FechaVista: new Date()
      });
  
      await this.sawRepo.save(saw);
  
    }
  }
}